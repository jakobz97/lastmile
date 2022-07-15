const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Delivery document for the shop
const shopDeliveryModel = new Schema({
    shopId: Object,
    stock: [{
        userId: Object,
        name: String,
        address: String,
        zip: String,
        city: String,
        package_type: String,
        timestamp: Number,
        targetDeliveryId: Object,
        status: {
            type: String,
            default: "Not picked up"
        },
        timePickedUp: Number
    }]
});

const ShopDelivery = mongoose.model('shop_deliveries', shopDeliveryModel);

// Setters =========================================================

/**
 * @function create a new delivery document
 * @param deliveryData which comprises the skeleton
 * @return the created delivery document
 */
exports.createDeliveryDoc = async (deliveryData) => {
    const delivery = new ShopDelivery(deliveryData);
    return delivery.save();
};

/**
 * @function create a new delivery (inbound/outbound) as a sub document
 * @param shopId is the id of the shop required to identify its delivery document
 * @param deliveryData which comprises the delivery data
 * @return the created delivery sub document
 */
exports.createStock = async (shopId, deliveryData) => {
    return ShopDelivery.findOneAndUpdate(
        { shopId: shopId },
        { $push: { stock: deliveryData } }
    )
};

// Getters ===========================================================

/**
 * @function (01) find one entry with respective email
 * @param shopId provided to check if this delivery document already exists
 */
exports.findByShopId = (shopId) => {
    return ShopDelivery.findOne({shopId: shopId}).select("stock");
};

// Remove ===========================================================

/**
 * @function (01) remove delivery doc for the shop
 * @param shopId to identify the user
 */
exports.removeById = (shopId) => {
    return ShopDelivery.deleteMany({shopId: shopId});
};

// Patch ===========================================================

/**
 * @function (01) remove delivery doc for the shop
 * @param shopId to identify the user
 */
exports.patchDelivery = async (shopId, subDocId, data) => {
    await ShopDelivery.findOneAndUpdate(
        { "shopId": shopId, "stock._id": subDocId },
        {
            "$set": {
                "stock.$.status": data.state,
                "stock.$.timePickedUp": data.timestamp
            }
        }
    );
};

// Helper functions  ===========================================================

/**
 * @function create session id and return it
 */
exports.createId = async () => {
    return mongoose.Types.ObjectId();
};
