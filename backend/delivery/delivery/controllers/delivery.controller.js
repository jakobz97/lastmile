let env = require('../../common/config/env.config.js'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto');

//Models
const DeliveryModel = require('../models/delivery.model');
const ShopDeliveryModel = require("../models/shop.delivery.model");

/**
 * @function (01) create the delivery document
 */
exports.create = async (req, res) => {
    //01
    await DeliveryModel.createDeliveryDoc(req.body)
    //02
    res.status(200).send({error: false});
};

/**
 * @function (00) enrich the request body with meta data
 *           (01) create the delivery sub document
 *           (02) on success append the data to the body and continue with the next function
 */
exports.createDelivery = async (req, res, next) => {
    //00
    req.body.timestamp = Math.floor(Date.now() / 1000);
    let subDocId = await DeliveryModel.createId();
    //01
    await DeliveryModel.createDelivery(req.body.userId, {...req.body, ...{_id: subDocId}})
    req.body.targetDeliveryId = subDocId;
    //02
    next();
};

/**
 * @function (01) get the delivery document for a specific user
 */
exports.getDeliveries = async (req, res) => {
    //01
    let deliveryData = await DeliveryModel.findByUserId(req.params.userId)
    //02
    res.status(200).json(deliveryData);
};

/**
 * @function (01) get the delivery document for a specific user and patch it
 */
exports.patchDelivery = async (req, res, next) => {
    //01
    let deliveryData = await DeliveryModel.patchDelivery(req.body.userId, req.body.targetDeliveryId, {state: "Picked up", timestamp: new Date().getTime() / 1000});
    //02
    res.status(200).json(deliveryData);
    //03
    next();
};

