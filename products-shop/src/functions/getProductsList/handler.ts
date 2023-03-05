import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from 'aws-sdk';
import {scanData} from "@functions/getProductsList/utils";
import {combineProductData} from "@libs/combineProductData";

AWS.config.update({region: 'eu-west-1'});

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

const getProductsList = async (event) => {
    console.log(`getProductsList lambda called with ${event}`);
    const productData = await scanData('aws-shop-table', dynamoDBClient);
    const stockData = await scanData('aws-table-stock', dynamoDBClient);
    const resultProduct = combineProductData(productData, stockData);

    const fullProductData = Object.keys(resultProduct).map(k => resultProduct[k])[0];
    try {
        return formatJSONResponse({
            data: fullProductData,
        });
    } catch (error) {
        return formatJSONResponse({
            message: 'Products not found',
            error: error,
        });
    }
};

export const main = middyfy(getProductsList);
