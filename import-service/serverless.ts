import type { AWS } from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from '@functions/importProductsFile';

const serverlessConfiguration: AWS = {
  service: 'import-files-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    iamRoleStatements: [{
      Action: ['s3:ListBucket', 's3:GetObject', 's3:PutObject',  's3:PutObjectAcl', 's3:DeleteObject', 's3:*',],
      Effect: 'Allow',
      Resource: ['arn:aws:s3:::import-files-aws-s3/*']
    },
      {
        Effect: 'Allow',
        Action: ['sqs: *', 'sqs:SendMessage'],
        Resource: ['arn:aws:sqs:eu-west-1:504799885106:catalogItemsQueue']
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BUCKET: 'import-files-aws-s3',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
