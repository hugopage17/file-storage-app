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