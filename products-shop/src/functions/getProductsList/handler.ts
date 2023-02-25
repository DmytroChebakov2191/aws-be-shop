import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import products from '../../mocks/product.mock'


const getProductsList = async (event) => {
  try {
    return formatJSONResponse({
      data: products,
      event,
    });
  } catch (error) {
    return formatJSONResponse({
      message: 'Products not found',
      error: error,
    });
  }
};

export const main = middyfy(getProductsList);
