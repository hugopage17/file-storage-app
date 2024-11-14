import type { AWS } from '@serverless/typescript';
import storageHandler from '@functions/storage';

const serverlessConfiguration: AWS = {
  service: 'rest-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    region: 'ap-southeast-2',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { storageHandler },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    plugins: ['serverless-cognito-identity-pool'],
    cognito: {
      userPoolId: '${file(./src/config.json):chrome_user_pool}',
      userPoolClientId: '${file(./src/config.json):user_pool_client}',
    },
  },
};

module.exports = serverlessConfiguration;
