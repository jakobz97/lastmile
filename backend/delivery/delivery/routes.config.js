const DeliveryMiddleware = require('./middlewares/delivery.middleware');
const DeliveryController = require('./controllers/delivery.controller');
const ShopDeliveryController = require('./controllers/shop.delivery.controller');

exports.routesConfig = (app) => {

    // Setters ====================================

    //Create a new delivery document
    app.post('/create/', [
        DeliveryMiddleware.duplicationCheck,
        DeliveryController.create
    ]);

    //Create a new delivery document for a shop
    app.post('/create/shop/', [
        ShopDeliveryController.create
    ]);

    //Create a new delivery sub document for a shop
    app.post('/create/shop/delivery/', [
        DeliveryController.createDelivery,
        ShopDeliveryController.createShopDelivery
        //todo send an outbound email to the target user
    ]);

    // Getters ====================================

    //Get all active deliveries for this user
    app.get('/deliveries/:userId', [
        DeliveryController.getDeliveries
    ]);

    //Get all active deliveries for this shop
    app.get('/deliveries/shop/:shopId', [
        ShopDeliveryController.getShopDeliveries
    ]);

    // Patches =====================================

    //Patch one specific delivery and set to delivered
    app.patch('/delivery/', [
        DeliveryController.patchDelivery,
        ShopDeliveryController.patchDelivery
    ]);
};
