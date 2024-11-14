import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoStack } from './cognito-stack';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class FileStorageAppInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new Bucket(this, 'file-storage-s3-bucket', {
            bucketName: 'growth-collective-app-storage-bucket',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new CognitoStack(this, 'file-storage-cognito-stack');
    }
}
