//Include models
const DeliveryModel = require('../models/shop.model')

//Crypto
const crypto = require('crypto');

// ===========================================================================================

/**
 * @function (01) check if user id linked shop doc already exists in the db
 *           (02) doc exists throw error
 *           (03) doc does not exist - continue
 */
exports.duplicationCheck = async (req, res, next) => {
    //todo adapt this to the shop worldd
    //01
    let delivery = await DeliveryModel.findByShopId(req.body.userId)
    //02
    if (delivery) return res.json({error: true})
    //03
    next();
}

