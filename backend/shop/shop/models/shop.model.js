const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Login sessions
const shopModel = new Schema({
    name: String,
    address: String,
    zip: String,
    city: String,
    country: String,
    lat: Number,
    lng: Number,

    owner_first_name: String,
    owner_last_name: String,

    customers: [{
        customerFName: String,
        customerLName: String,
        userID: Object
    }]
});

const Shop = mongoose.model('shops', shopModel);

// Setters =========================================================

/**
 * @function create a new shop document
 * @param deliveryData which comprises the skeleton
 * @return the created shop document
 */
exports.createShopDoc = async (deliveryData) => {
    const shop = new Shop(deliveryData);
    return shop.save();
};

/**
 * @function create a new shop (inbound/outboound) as a sub document
 * @param userId is the id of the user required to identify its shop document
 * @param deliveryData which comprises the shop data
 * @return the created shop sub document

exports.createDelivery = (userId, deliveryData) => {
    return Shop.findOneAndUpdate(
        { userId: userId },
        { $push: { inbound: deliveryData } }
    )
};
 */

// Getters ===========================================================

/**
 * @function (01) find one entry via shop id
 * @param shopId provided to find the shop
 */
exports.findByShopId = (shopId) => {
    return Shop.findById(shopId);
};

/**
 * @function (01) find one entry via shop id
 * @param city provided to find all shops close by
 */
exports.findByCity = (city) => {
    return Shop.find({ city: city }).select('name lat lng');
};

// Remove ===========================================================

/**
 * @function (01) remove shop doc
 * @param shopId to identify the shop
 */
exports.removeById = (shopId) => {
    return Shop.deleteMany({_id: shopId});
};
