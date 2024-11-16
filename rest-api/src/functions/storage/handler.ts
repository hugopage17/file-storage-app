import { middyfy } from '@libs/lambda';
import { HttpType } from '@libs/models/http-type';
import { eventService } from '@libs/event-service';
import { EventType } from '@libs/models/event-type';
import { fileStorageService } from '../../services/file.storage.service';

export const endpoints: EventType.Endpoint[] = [
    {
        path: 'storage/upload',
        method: HttpType.Method.POST,
        execute: async(event) => await fileStorageService.upload(event),
    },
    {
        path: 'storage/list',
        method: HttpType.Method.POST,
        execute: async(event) => await fileStorageService.listDirectory(event),
    },
    {
        path: 'storage/download',
        method: HttpType.Method.POST,
        execute: async(event) => await fileStorageService.download(event),
    },
    {
        path: 'storage/delete',
        method: HttpType.Method.DELETE,
        execute: async(event) => await fileStorageService.deleteObject(event),
    }
];

const storageHandler = async (event) => {
    const endpoint = eventService.getEventEndpoint(event, endpoints);
    return await endpoint.execute(event);
};

export const main = middyfy(storageHandler);
