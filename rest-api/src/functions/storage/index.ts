import { handlerPath } from '@libs/handler-resolver';
import authorizer from '@libs/authorizer';
import { uploadFileSchema, listDirectorySchema } from './schemas';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    STORAGE_BUCKET: '${file(./src/config.json):file_storage_bucket}'
  },
  iamRoleStatementsName: 'storage-app-storage-handler',
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:GetObject', 's3:ListBucket', 's3:DeleteObject'],
      Resource: ['arn:aws:s3:::${file(./src/config.json):file_storage_bucket}', 'arn:aws:s3:::${file(./src/config.json):file_storage_bucket}/*']
    },
  ],
  events: [
    {
      http: {
        method: 'post',
        path: 'storage/upload',
        cors: true,
        authorizer,
        request: {
          schemas: {
            'application/json': uploadFileSchema,
          },
        },
      },
    },
    {
      http: {
        method: 'post',
        path: 'storage/list',
        cors: true,
        authorizer,
        request: {
          schemas: {
            'application/json': listDirectorySchema,
          },
        },
      },
    },
    {
      http: {
        method: 'post',
        path: 'storage/download',
        cors: true,
        authorizer,
        // request: {
        //   schemas: {
        //     'application/json': listDirectorySchema,
        //   },
        // },
      },
    },
    {
      http: {
        method: 'delete',
        path: 'storage/delete',
        cors: true,
        authorizer,
      },
    },
  ],
};
