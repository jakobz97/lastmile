const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config')['jwt_secret'];

/**
 * @function (01) check if user has shop status
 *           (02) perform the next operation
 * @return next if permission levels have been passed
 */
exports.reqShop = (req, res, next) => {
    //01
    if (req.jwt.type !== 'shop') return res.status(403).send();
    //02
    return next();
};

/**
 * @function (01) check if user has user status
 *           (02) perform the next operation
 * @return next if permission levels have been passed
 */
exports.reqUser = (req, res, next) => {
    //01
    if (req.jwt.type !== 'user') return res.status(403).send();
    //02
    return next();
};

