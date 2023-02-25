import products from '../mocks/product.mock'
import { findProductId } from "../libs/find-product-id";

describe('Products', function () {
    it('get product by id', async () => {
        const result = await findProductId(1);
        expect(result).toEqual(products);
    });
});
