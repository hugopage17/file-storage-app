export enum ObjectTypeOptions {
    FOLDER = 'Folder',
    FILE = 'File',
}

export interface StorageObject {
    CreatedAt: Date;
    Key: string;
    LastModified: Date;
    Metadata: Record<string, string>;
    Size?: number;
    FullPath: string;
    ContentType: string;
}

export interface User {
  at_hash: string;
  aud: string;
  auth_time: number;
  "cognito:username": string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  sub: string;
  token_use: string;
};

export interface IUploadParams {
    fileName: string;
    fileData: string | ArrayBuffer | null;
    contentType: string;
    contentEncoding?: string;
    isFolder?: boolean
}