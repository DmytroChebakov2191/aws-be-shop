import * as AWS from 'aws-sdk';

import {formatInternalError, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {combineProductData} from "@libs/combineProductData";

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

const getProductsById = async (event) => {
    console.log(`getProductsById lambda called with ${event}`);
    try {
        if (event.pathParameters && event.pathParameters.productId) {
            const {productId} = event.pathParameters;

            const queryResultProduct = await dynamoDBClient.query({
                TableName: 'aws-shop-table',
                KeyConditionExpression: 'id = :id',
                ExpressionAttributeValues: {':id': +productId}
            }).promise();

            const queryResultStock = await dynamoDBClient.query({
                TableName: 'aws-table-stock',
                KeyConditionExpression: 'product_id = :product_id',
                ExpressionAttributeValues: {':product_id': +productId}
            }).promise();

            if (!queryResultProduct.Items.length) {
                return 'Not found product'
            }
            const resultProduct = combineProductData(queryResultProduct.Items, queryResultStock.Items);

            const fullProductData = Object.keys(resultProduct).map(k => resultProduct[k])[0];

            return formatJSONResponse(fullProductData);
        }
    } catch (error) {
        return formatInternalError;
    }
};


export const main = middyfy(getProductsById);
