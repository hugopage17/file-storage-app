import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { CloudFrontWebDistribution, OriginAccessIdentity, CloudFrontAllowedMethods, CloudFrontAllowedCachedMethods } from 'aws-cdk-lib/aws-cloudfront';
import { CognitoStack } from './cognito-stack';
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
        const appCdn = new CloudFrontWebDistribution(this, `${id}-WebsiteDistribution`, {
            originConfigs: [
                {
                s3OriginSource: {
                    s3BucketSource: spaHostingBucket,
                    originAccessIdentity,
                },
                behaviors: [
                    {
                    isDefaultBehavior: true,
                    allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                    cachedMethods: CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                    forwardedValues: {
                        queryString: false,
                        cookies: {
                        forward: 'none',
                        },
                    },
                    },
                ],
                },
            ],
            errorConfigurations: [
                {
                    errorCode: 403,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                    errorCachingMinTtl: 60,
                },
                {
                    errorCode: 404,
                    responseCode: 200,
                    responsePagePath: '/index.html',
                    errorCachingMinTtl: 60,
                },
            ],
        });

        const githubSecret = Secret.fromSecretNameV2(this, 'github-auth-secret','github/oauth/secret')

        new CognitoStack(this, 'file-storage-cognito-stack', {
            cloudfontUrl: appCdn.distributionDomainName
        });

        new CICDStack(this, 'file-storage-app-cicd-stack', {
            githubSecretName: githubSecret.secretName,
            appCdn,
            appName: 'file-storage-app',
            spaHostingBucket
        })
    }
}
