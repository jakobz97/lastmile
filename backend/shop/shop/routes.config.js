const ShopMiddleware = require('./middlewares/shop.middleware');
const ShopController = require('./controllers/shop.controller');

exports.routesConfig = (app) => {

    // Setters ====================================

    //Create a new shop document
    app.post('/create/', [
        //ShopMiddleware.duplicationCheck,
        ShopController.create
    ]);

    // Getters ====================================

    //Get all shops based on city
    app.get('/shops/:city', [
        ShopController.getShops
    ]);

    //Get a specific shop information including customers
    app.get('/shop/:shopId', [
        ShopController.getShop
    ]);
};
