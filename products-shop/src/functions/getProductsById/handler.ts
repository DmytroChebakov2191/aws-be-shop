import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { findProductId } from "@libs/find-product-id";

const getProductsById = async (event) => {
    try {
        const productId = event.pathParameters.productId;

        const videoGamesProduct = await findProductId(productId)
        return formatJSONResponse({
            data: videoGamesProduct,
        });
    } catch (error) {
        return formatJSONResponse({
            message: 'Product not found',
            error: error,
        });
    }
}

export const main = middyfy(getProductsById);
