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
