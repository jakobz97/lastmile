//Models
const ShopDeliveryModel = require('../models/shop.delivery.model');
const DeliveryModel = require('../models/delivery.model');

/**
 * @function (01) create the delivery document
 */
exports.create = async (req, res) => {
    //01
    await ShopDeliveryModel.createDeliveryDoc(req.body)
    //02
    res.status(200).send({error: false});
};

/**
 * @function (00) create a predefined id for the subdocument
 *           (01) create a specific delivery sub document for the shop side
 *           (02) merge the id with the request body and return it
 */
exports.createShopDelivery = async (req, res) => {
    //00
    req.body._id = await ShopDeliveryModel.createId();
    //01
    const shopData = await ShopDeliveryModel.createStock(req.body.shopId, req.body)
    //02
    res.status(200).json({...req.body, ...{status: 'Not picked up'}});
};

/**
 * @function (01) get the delivery document for a specific shop
 */
exports.getShopDeliveries = async (req, res) => {
    //01
    let deliveryData = await ShopDeliveryModel.findByShopId(req.params.shopId)
    //02
    res.status(200).json(deliveryData);
};

/**
 * @function (01) patch the delivery document
 */
exports.patchDelivery = async (req, res) => {
    //01
    let deliveryData = await ShopDeliveryModel.patchDelivery(req.body.shopId, req.body._id, {state: "Picked up", timestamp: new Date().getTime() / 1000});
    //02
    res.status(200).json(deliveryData);
};

