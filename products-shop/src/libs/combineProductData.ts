export const combineProductData = (product, stock) => {
    return product.concat(stock).reduce((acc, x) => {
        acc[x.id] = Object.assign(acc[x.product_id] || {}, x);
        delete acc[x.id].product_id;
        return acc;
    }, {});
}
