const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'google',
    apiKey: 'AIzaSyD4RJeYLCNhQe2LaqI9dCSIcdPjHI3Hfo0',
    formatter: null
};
const geocoder = NodeGeocoder(options);

let env = require('../../common/config/env.config.js'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto');

//Models
const ShopModel = require('../models/shop.model');

/**
 * @function (01) fetch based on the address lat and lng of this shop
 *           (02) get the lat lng from the geocoding and extend the request body
 *           (03) create the shop document
 *           (04) return no error code if request was successful
 */
exports.create = async (req, res) => {
    //01
    const geocode = await geocoder.geocode(`${req.body.address}, ${req.body.zip} ${req.body.city}`);
    //02
    req.body = {...req.body, ...{lat: geocode[0].latitude, lng: geocode[0].longitude, country: geocode[0].country}}
    //03
    const shopData = await ShopModel.createShopDoc(req.body)
    //04
    res.status(200).send(shopData);
};

/**
 * @function (01) get all shops based on city / country
 *           (02) get lat lng from the requested city
 *           (03) return the merged data
 */
exports.getShops = async (req, res) => {
    //01 & 02
    let shopData = await ShopModel.findByCity(req.params.city),
        geocode = await geocoder.geocode(`${req.params.city}`);
    //03
    res.status(200).send({error: false, shops: shopData, center: {lat: geocode[0].latitude, lng: geocode[0].longitude}});
};

/**
 * @function (01) get all shops based on city / country
 *           (02) get lat lng from the requested city
 *           (03) return the merged data
 */
exports.getShop =async (req, res) => {
    //01 & 02
    let shopData = await ShopModel.findByShopId(req.params.shopId);
    //03
    res.status(200).json(shopData);
};

