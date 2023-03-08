import {formatBadRequest, formatInternalError, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuidv4 } from 'uuid';
import {ValidationError} from "@libs/validationError";
import * as AWS from 'aws-sdk';
AWS.config.update({region: 'eu-west-1'});
const ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

const createProduct = async (event) => {
    if (!event.body) throw new ValidationError('No product data provided');
    const data = event.body;
    const resultData = await createProductItem(data);

    return formatJSONResponse({
        data: resultData,
        event,
    });
};

const createProductItem = async(body) => {
    const productId = uuidv4();

    try {
        try {
            await ddbDocumentClient.transactWrite({
                TransactItems: [
                    {
                        Put: {
                            Item: {
                                id: productId,
                                title: body.title || '',
                                price: body.price || '',
                                description: body.description || ''
                            },
                            TableName: 'aws-shop-table'
                        },
                    },
                    {
                        Put: {
                            Item: {
                                product_id: productId,
                                stock: body.stock || ''
                            },
                            TableName: 'aws-table-stock'
                        },
                    }
                ],
            }).promise();
            return {...body, id: productId};
        } catch (e) {
            return formatBadRequest();
        }
    } catch (error) {
        return formatInternalError();
    }
}

export const main = middyfy(createProduct);
