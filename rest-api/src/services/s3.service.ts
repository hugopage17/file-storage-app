import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsCommandOutput, PutObjectCommandInput, ListObjectsCommand, GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';

interface IUploadParams {
  fileName: string;
  fileData: any;
  contentType: string;
  contentEncoding?: string;
}

export enum ObjectTypeOptions {
  FOLDER = 'Folder',
  FILE = 'File',
}

export interface StorageObject {
  CreatedAt: Date;
  Key: string;
  LastModified: Date;
  ObjectType: ObjectTypeOptions;
  Metadata: Record<string, string>;
  Size: number;
  Tag: string;
  FullPath: string;
}

export interface IS3ServiceClient {
    listObjects(path: string, userId: string): Promise<ListObjectsCommandOutput>
    upload(params: IUploadParams): Promise<{ Message: string; Key: string; }>
    deleteFile(key: string): Promise<void>
    getObject(key: string): Promise<GetObjectCommandOutput>
}

export class S3ServiceClient implements IS3ServiceClient {
  private s3: S3Client;

  constructor(private bucketName: string) {
    this.s3 = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

    async listObjects(path: string, userId: string) {
        const params = {
            Bucket: this.bucketName,
            Prefix: path == '/' ? `${userId}/` : `${userId}${path}/`,
            Delimiter: '/'
        };

        try {
            const output = await this.s3.send(new ListObjectsCommand(params))
            console.log(output)
            return output as any;
        } catch (error) {
            console.error('Error listing objects:', error);
            return [];
        }
    }

  async upload({ fileData, fileName, contentType, contentEncoding }: IUploadParams): Promise<{ Message: string; Key: string; }> {
    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileData,
      ContentType: contentType,
      ContentEncoding: contentEncoding,
    };

    const uploadCommand = new PutObjectCommand(params);
    try {
      await this.s3.send(uploadCommand);
      return {
        Message: 'File uploaded successfully',
        Key: fileName
      };
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async deleteFile(Key: string) {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key,
        })
      );
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getObject(Key: string) {
    const getObject = new GetObjectCommand({
        Bucket: this.bucketName,
        Key,
    });
    return await this.s3.send(getObject);
  }
}
