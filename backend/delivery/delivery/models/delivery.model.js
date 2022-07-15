const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Login sessions
const deliveryModel = new Schema({
    userId: Object,
    inbound: [{
        timestamp: Number,
        sName: String,
        sAddress: String,
        sZIP: String,
        sCity: String,
        package_type: String,
        status: {
            type: String,
            default: "Not picked up"
        },
        timePickedUp: Number,
        shopId: Object,
        enabledPickup: [{
            firstName: String,
            lastName: String,
            identified: Boolean,
            userId: Object,
            secondFactorType: String,
            secondFactorId: String
        }]
    }],
    outbound: [{
        timestamp: Number,
        rName: String,
        rAddress: String,
        rZIP: String,
        rCountry: String,
        package_type: String,
        status: String
    }]
});

const Delivery = mongoose.model('deliveries', deliveryModel);

// Setters =========================================================

/**
 * @function create a new delivery document
 * @param deliveryData which comprises the skeleton
 * @return the created delivery document
 */
exports.createDeliveryDoc = async (deliveryData) => {
    const delivery = new Delivery(deliveryData);
    return delivery.save();
};

/**
 * @function create a new delivery (inbound/outboound) as a sub document
 * @param userId is the id of the user required to identify its delivery document
 * @param deliveryData which comprises the delivery data
 * @return the created delivery sub document
 */
exports.createDelivery = (userId, deliveryData) => {
    return Delivery.findOneAndUpdate(
        { userId: userId },
        { $push: { inbound: deliveryData } }
    )
};

// Getters ===========================================================

/**
 * @function (01) find one entry with respective email
 * @param userId provided to check if this delivery document already exists
 */
exports.findByUserId = (userId) => {
    return Delivery.findOne({userId: userId}).select("inbound outbound");
};

// Remove ===========================================================

/**
 * @function (01) remove delivery doc
 * @param userId to identify the user
 */
exports.removeById = (userId) => {
    return Delivery.deleteMany({userId: userId});
};

//Patches ===============================================================

/**
 * @function update subdocument
 */
exports.patchDelivery = async (userId, subDocId, data) => {
    await Delivery.findOneAndUpdate(
        { "userId": userId, "inbound._id": subDocId },
        {
            "$set": {
                "inbound.$.status": data.state,
                "inbound.$.timePickedUp": data.timestamp,
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

