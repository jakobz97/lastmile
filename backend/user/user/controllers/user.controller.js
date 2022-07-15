let env = require('../../common/config/env.config.js'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto');

//Models
const UserModel = require('../models/user.model');

/**
 * @function (01) create the user document
 *           (02) return no error code if request was successful
 */
exports.createUser = async (req, res) => {
    //01
    const userData = await UserModel.createUser(req.body)
    //02
    res.status(200).send(userData);
};

/**
 * @function (01) XX
 */
exports.getUser = async (req, res) => {

};

/**
 * @function (01) call the find user by name function and store the result
 *           (02) give back no error code and return the found user data
 */
exports.findUsers = async (req, res) => {
    //01
    const foundUsers = await UserModel.findByAggregatedName(req.params.name)
    //02
    res.status(200).send({error: false, userData: foundUsers});
}
