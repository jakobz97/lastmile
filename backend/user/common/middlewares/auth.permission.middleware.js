const jwt = require('jsonwebtoken'),
    secret = require('../config/env.config')['jwt_secret'];

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {

    //todo: split into main jwt (small and fast)
    //todo: this middle layer was misused - simply use the req.jwt instead no need to add all of them to the params
    //and large jwt where all additional information such as name is stored
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! todo no need to transform since the req.jwt is passed along with all layers !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    //params
    req.params.userId = req.jwt.userId;
    req.params.enterpriseId = req.jwt.enterpriseId;
    req.params.eventListId = req.jwt.eventListId;
    req.params.contactListId = req.jwt.contactListId;
    req.params.requestsId = req.jwt.requestsId;
    req.params.sessionListId = req.jwt.sessionListId;

    //body //todo: find a significantly better solution - store client side and only send when required (few use cases)
    req.params.firstName = req.jwt.firstName;
    req.params.lastName = req.jwt.lastName;
    req.params.profile_img = req.jwt.profile_img;
    req.params.position = req.jwt.position;
    req.params.department = req.jwt.department;
    req.params.firm = req.jwt.firm;

    return next();

    /*
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level & ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send();
        }
    }
     */

};


/**
 * @function (01) check if user has admin status
 *           (02) user is admin therefore append the enterprise id to the request params to continue
 *           //todo: check if provided param and jwt param are equal (tbd)
 * @return next if permission levels have been passed
 */
exports.enterpriseAdminLevel = (req, res, next) => {
    //01
    if (!req.jwt.admin) return res.status(403).send();
    //02
    return next();
};



exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;

    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }

};
