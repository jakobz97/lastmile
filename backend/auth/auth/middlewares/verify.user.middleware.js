//Models
const LoginSessionModel = require('../models/login.session.model');

//Crypto
const crypto = require('crypto');

// ===========================================================================================

/**
 * @function (01) find user by userId - previously found in the global user table
 *           (02) check if user exists
 *           (03) decrypt password and check if they match
 *           (04) perform an index search on the user either in the database linked to this server or cross server request - obtain user data
 *           (04) create token object which has all data included in the token
 *           (05) create user object where all non vulnerable data is stored - do not include security risked data
 */
/*
exports.isPasswordAndUserMatch = (req, res, next) => {
    //01
    UserModel.findId(req.body.userId)
        .then((user)=>{
            //02
            if (!user || user.blocked) return res.status(404).send({errorCode: "a_04"});
            //03
            let passwordFields = user.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                //04 todo: add all other ids contact id, request id and so on
                req.body.tokenData = {
                    //identifiers
                    userId: user._id,
                    enterpriseId: user.enterpriseId,
                    requestId: user.requestId,
                    contactId: user.contactId,
                    notificationId: user.notificationId,
                    eventListId: user.eventListId,
                    sessionListId: user.sessionId,
                    contactListId: user.contactListId,
                    requestsId: user.requestsId,
                    admin: user.admin,
                    //essential user data
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profile_img: user.profile_img,
                    position: user.position,
                    department: user.department,
                    firm: user.firm
                };
                //05 todo: do not send security vulnerable data to client password and ids - filter them out or use separate collection for this - or even separate service
                req.body.userData = user;
                req.body.userData = {
                    firstName: user.firstName,
                    homeViewSchema: user.homeViewSchema,
                    admin: user.admin
                }
                return next();
            } else {
                return res.status(400).send({errorCode: 'a_05'});
            }
        });
};
*/


/**
 * @function (01) check if email already exists in the db
 *           (02) email exists throw error
 *           (03) unique email address - continue
 */
exports.duplicateUserCheck = async (req, res, next) => {
    //01
    let user = await LoginSessionModel.findByEmail(req.body.email)
    //02
    if (user) return res.json({error: true})
    //03
    next();
}

