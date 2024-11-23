import React from "react";
import { StorageObject } from "../types";
import { apiService } from "./api.service";

type HandlerEvent = React.MouseEvent<HTMLLIElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>

export default class StorageObjectService {
    static async downloadObject(storageObject: StorageObject, event?: HandlerEvent) {
        event?.stopPropagation();
        const path = storageObject.ContentType.split('/').pop() === 'folder' ? `${storageObject.FullPath.slice(1)}/` : storageObject.FullPath
        const { url } = await apiService.download(path);
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = url;
        link.download = storageObject.Key;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    static async deleteObject(storageObject: StorageObject, event?: HandlerEvent) {
        event?.stopPropagation();
        const path = storageObject.ContentType.split('/').pop() === 'folder' ? `${storageObject.FullPath.slice(1)}/` : storageObject.FullPath
        await apiService.deleteObject(path)
        window.location.reload()
    }

    static async processFileOnDrop(acceptedFiles: File[], filePaths: string[]){
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            const reader = new FileReader();
            const fileType = file.type;
            let contentEncoding: string | undefined;

            await new Promise<void>((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        if (fileType.startsWith('image/') || fileType === 'application/pdf') {
                            contentEncoding = 'base64';
                        }
                        await apiService.upload({
                            fileData: reader.result,
                            fileName: location.pathname === '/storage' ? decodeURIComponent(file.name) : decodeURIComponent(`${filePaths.join('/')}/${file.name}`),
                            contentType: fileType,
                            contentEncoding,
                        });
                        window.location.reload();

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => {
                    reject(new Error('Error reading the file.'));
                };

                if (fileType.startsWith('text/') || fileType.endsWith('json')) {
                    reader.readAsText(file);
                } else if (fileType.startsWith('image/') || fileType === 'application/pdf') {
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('Unsupported file type'));
                }
            });

            reader.onerror = () => {
                console.error('Failed to read file!');
            };
        }
    }
}