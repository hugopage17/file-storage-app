import { Construct } from 'constructs';
import { NestedStack, NestedStackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { OAuthScope, UserPool } from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: NestedStackProps) {
        super(scope, id, props);

        const autoVerifyFunction = new lambda.Function(this, 'AutoVerifyFunction', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`
                exports.handler = async (event) => {
                    // Automatically verify the user's email
                    console.log(JSON.stringify(event, null, 2))
                    event.response.autoConfirmUser = true;
                    event.response.autoVerifyEmail = true;
                    return event;
                };
            `),
        });

        const userPool = new UserPool(this, 'file-storage-userpool', {
            userPoolName: 'file-storage-userpool',
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            lambdaTriggers: {
                preSignUp: autoVerifyFunction,
            },
            passwordPolicy: {
                minLength: 6,
                requireLowercase: false,
                requireUppercase: false,
                requireDigits: false,
                requireSymbols: false,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: false,
                },
            },
        });

        const userPoolDomain = userPool.addDomain('UserPoolDomain', {
            cognitoDomain: {
                domainPrefix: 'file-storage-app',
            },
        });

        const appClient = userPool.addClient('file-storage-app-client', {
            authFlows: {
                userPassword: true,
                userSrp: true,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
                scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
                callbackUrls: ['http://localhost:5173/auth/callback'],
                logoutUrls: ['http://localhost:5173/signin'],
            },
        });

        new CfnOutput(this, 'CognitoHostedUIUrl', {
            value: `https://${userPoolDomain.domainName}.auth.ap-southeast-2.amazoncognito.com/login?client_id=${appClient.userPoolClientId}&response_type=code&scope=openid&redirect_uri=http://localhost:5173/auth/callback`,
        });

        new CfnOutput(this, 'UserPoolId', {
            value: userPool.userPoolId,
        });
    }
}
