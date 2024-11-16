import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Distribution, OriginAccessIdentity, CloudFrontAllowedMethods, CloudFrontAllowedCachedMethods } from 'aws-cdk-lib/aws-cloudfront';
import { CognitoStack } from './cognito-stack';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { CICDStack } from './cicd-stack';

export class FileStorageAppInfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const storageBucket = new Bucket(this, 'file-storage-s3-bucket', {
            bucketName: 'growth-collective-app-storage-bucket',
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        const spaHostingBucket = new Bucket(this, `file-storage-s3-bucket-hosting-bucket`, {
            bucketName: `file-storage-s3-bucket-hosting-bucket`,
            websiteIndexDocument: 'index.html',
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
            accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
            removalPolicy: RemovalPolicy.DESTROY,
        });


        const originAccessIdentity = new OriginAccessIdentity(this, `${id}-OriginAccessIdentity`);
        const appCdn = new Distribution(this, `${id}-WebsiteDistribution`, {
            defaultBehavior: {
                origin: new origins.OriginGroup({
                    primaryOrigin: origins.S3BucketOrigin.withOriginAccessControl(spaHostingBucket),
                    fallbackOrigin: new origins.HttpOrigin(spaHostingBucket.bucketWebsiteUrl),
                    fallbackStatusCodes: [404, 403],
                }),
            }
        });

        const githubSecret = new Secret(this, 'github-auth-secret', {
            secretName: 'github/oauth/secret'
        })

        new CognitoStack(this, 'file-storage-cognito-stack');

        new CICDStack(this, 'file-storage-app-cicd-stack', {
            githubSecretName: githubSecret.secretName,
            appCdn,
            appName: 'file-storage-app',
            spaHostingBucket
        })
    }
}
