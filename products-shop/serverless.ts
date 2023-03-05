import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct  from '@functions/createProduct';

const serverlessConfiguration: AWS = {
  service: 'products-shop',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_NAME: 'aws-shop-table',
      STOCK_TABLE: 'aws-stock-table',
    },
  },
  // import the function via paths
    functions: { getProductsList, getProductsById, createProduct  },
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
    autoswagger: {
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      schemes: ["https", "ws", "wss"],
      excludeStages: ['production', 'anyOtherStage'],
      host: 'mrn9o3mn0c.execute-api.eu-west-1.amazonaws.com/dev'
    },
      iamRoleStatements: [
        {
            Effect: "Allow",
            Action: [
                "dynamodb:DescribeTable",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            Resource: "arn:aws:dynamodb:eu-west-1:504799885106:table/aws-shop-table"
        }
    ]
  },

};

module.exports = serverlessConfiguration;
