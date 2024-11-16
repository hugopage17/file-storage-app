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
}