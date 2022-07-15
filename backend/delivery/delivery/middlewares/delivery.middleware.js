//Include models
const DeliveryModel = require('../models/delivery.model')
const ShopDeliveryModel = require('../models/shop.delivery.model')

//Crypto
const crypto = require('crypto');

// ===========================================================================================

/**
 * @function (01) check if user id linked delivery doc already exists in the db
 *           (02) doc exists throw error
 *           (03) doc does not exist - continue
 */
exports.duplicationCheck = async (req, res, next) => {
    //01
    let delivery = await DeliveryModel.findByUserId(req.body.userId)
    //02
    if (delivery) return res.json({error: true})
    //03
    next();
}

