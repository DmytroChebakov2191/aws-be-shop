import products from '../mocks/product.mock'

export const findProductId = (productId) => {
    return new Promise((res) => {
        const currentProduct = products.find(product => product.id === productId)
        res(currentProduct)
    })
};
