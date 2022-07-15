const jwt = require('jsonwebtoken'),
    env = require('../config/env.config.js'),
    crypto = require('crypto');

/**
 * @function (01) check if user has set any auth header - if not return error
 *           (02) split the auth header and obtain the bearer token - double check if token provided is a bearer
 *           (03) verify that the token is valid by using the access secret and check against the expiry time
 *           (04) check if the token is expired / or wrong signature has been used - if true call the refresh token function and check if new access token can be obtained - if false return and let user login again
 */
exports.validJWTNeeded = (req, res, next) => {
    //01
    if (req.headers['authorization']) {
        try {
            //02
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                //03
                jwt.verify(authorization[1], env.jwt_access_secret, (err, decoded) => {
                    //04
                    if (err) return res.status(403).json({"error_code":err});
                    req.jwt = decoded
                    return next()
                });
            }
        } catch (err) {
            return res.status(403).json({"error from catch":err});
        }
    } else {
        return res.status(401).send();
    }
};

/**
 * @function (01) check if user has set any auth header
 *           (02) try to extract the bearer token and verify it using the secret
 *           (03) return to the next function where jwt data is processed
 */
exports.optionalJWT = (req, res, next) => {
    //01
    if (req.headers['authorization']) {
        //02
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] === 'Bearer') {
                req.jwt = jwt.verify(authorization[1], env.jwt_access_secret);
                //03
                return next();
            }
        } catch (err) {
            return next();
        }
    }
    return next();
};

/**
 * @function (01) check if user has any auth header - if false continue
 *           (02) try obtain the bearer token and validate it - if this fails continue
 *           (03) valid jwt was found - user is logged in - return error
 */
exports.noJWT = (req, res, next) => {
    //01
    if (req.headers['authorization']) {
        //02
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] === 'Bearer') {
                req.jwt = jwt.verify(authorization[1], env.jwt_access_secret);
                //03
                res.status(403).json({error_code:"e_001"})
            }
        } catch (err) {
            return next();
        }
    }
    return next();
};

