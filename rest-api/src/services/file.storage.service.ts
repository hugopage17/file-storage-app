import { APIGatewayProxyEvent } from 'aws-lambda';
import { CommonPrefix, _Object } from '@aws-sdk/client-s3';
import { IS3ServiceClient, S3ServiceClient } from './s3.service';
import { Response } from './response.service';

export interface IFormatStorageObject {
    contents: (CommonPrefix | _Object)[];
    path: string;
    userId: string;
}

class FileStorageService {
    constructor(private s3Service: IS3ServiceClient) {

    }

    async listDirectory(event: APIGatewayProxyEvent) {
        console.info(JSON.stringify(event, null, 2))
        const { directory } = JSON.parse(JSON.stringify(event.body));
        console.info(event.body)
        const claims = event.requestContext.authorizer.claims;

        const listObjectsResponse = await this.s3Service.listObjects(directory, claims.sub);

        const content = listObjectsResponse?.Contents ?? [];
        const commonPrefixes = listObjectsResponse?.CommonPrefixes ?? [];

        const directoryObjects = await this.formatStorageObjects({
            contents: [...content, ...commonPrefixes],
            path: directory,
            userId: claims.sub
        })
        return new Response.OK(directoryObjects)
    }

    async upload(event: APIGatewayProxyEvent) {
        const { fileName, fileData, contentType, contentEncoding } = JSON.parse(JSON.stringify(event.body));
        const claims = event.requestContext.authorizer.claims;
        let fileBody = fileData;
        if(contentType.split('/')[0] === 'image') {
            fileBody = Buffer.from(fileData.replace(/^data:image\/\w+;base64,/, ""),'base64')
        } else if (contentType === 'application/pdf') {
            fileBody = Buffer.from(fileData.replace(/^data:application\/pdf;base64,/, ""), 'base64');
        }
        
        await this.s3Service.upload({
            fileName: `${claims.sub}/${fileName}`,
            fileData: fileBody,
            contentType,
            contentEncoding
        })
        return new Response.OKCreated({Message: 'File Uploaded'})
    }

    async formatStorageObjects({ contents, userId, path }: IFormatStorageObject) {
        const formattedContent = await Promise.all(
            contents?.map(async (content) => {
                if ("Prefix" in content) {
                    const s3Object = await this.s3Service.getObject(content.Prefix);
                    return {
                        LastModified: s3Object.LastModified,
                        Key: content.Prefix.replace(`${userId}${path}`, '').slice(0, -1).replaceAll('/',''),
                        CreatedAt: s3Object.LastModified,
                        Metadata: s3Object?.Metadata,
                        FullPath: content.Prefix.replace(`${userId}`, '').slice(0, -1),
                        ContentType: 'plain/folder'
                    };
                } else if ("Key" in content) {
                    if(content.Key == `${userId}${path}/`) {
                        return null
                    }
                    const s3Object = await this.s3Service.getObject(content.Key);
                    return {
                        LastModified: content.LastModified,
                        Key: content.Key?.replace(`${userId}${path}`, '').replaceAll('/',''),
                        Size: content.Size,
                        CreatedAt: content.LastModified,
                        Metadata: s3Object?.Metadata,
                        FullPath: content.Key.replace(`${userId}/`, ''),
                        ContentType: s3Object.ContentType
                    };
                }
            })
        ) ?? [];
        return formattedContent.filter(Boolean).sort((a, b) => new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime())
    }

    async download(event: APIGatewayProxyEvent) {
        const { path } = JSON.parse(JSON.stringify(event.body));
        const claims = event.requestContext.authorizer.claims;
        
        const presignedUrl = await this.s3Service.generatePresignedUrl(`${claims.sub}/${path}`)
        return new Response.OKCreated({ url: presignedUrl })
    }

    async deleteObject(event: APIGatewayProxyEvent) {
        const { path } = JSON.parse(JSON.stringify(event.body));
        const claims = event.requestContext.authorizer.claims;
        
        await this.s3Service.deleteFile(`${claims.sub}/${path}`)
        return new Response.OKNoContent()
    }
}

export const fileStorageService = new FileStorageService(new S3ServiceClient(process.env.STORAGE_BUCKET!))