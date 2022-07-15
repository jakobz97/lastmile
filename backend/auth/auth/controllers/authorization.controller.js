let env = require('../../common/config/env.config.js'),
    jwt = require('jsonwebtoken'),
    crypto = require('crypto');

//Models
const LoginSessionModel = require('../models/login.session.model');
const RevokedSessionModel = require('../models/revoked.session.model');

//Kafka
//const producer = require('../../common/services/kafka.service');

/**
 * @function (00) create session, sub session and user id
 *           (01) create the tokens
 *           (02) transform the password
 *           (03) create a new session document for this user - including first sub session
 *           (04) todo create long term session document for this user
 *           (05) return jwt and set cookie
 */
exports.create = async (req, res) => {
    //00
    let sessionId = await LoginSessionModel.createId(),
        sessionSubId = await LoginSessionModel.createId();
    if (req.body.type === 'shop') req.body.userId = await LoginSessionModel.createId();

    //01
    let payload = {};
    payload['type'] = req.body.type;
    if (req.body.type === 'shop') payload['shopId'] = req.body.shopId;
    payload['userId'] = req.body.userId;
    let token = jwt.sign(payload, env.jwt_access_secret, {expiresIn: env.jwt_exp});
    let tokenExp = Math.floor(Date.now() / 1000) + env.jwt_exp;
    let refreshToken = jwt.sign({"loginSessionId":sessionId, "loginSessionSubId":sessionSubId, "userId":req.body.userId}, env.jwt_refresh_secret);

    //02
    let salt = crypto.randomBytes(16).toString('base64'),
        hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;


    //03
    let loginSessionDocument = {
        ...req.body,
        ...{
            _id: sessionId,
            activeSessions: [{
                "_id": sessionSubId,
                //"device": handle device by external kafka provided update service
                //"ua":req.body.device,
                //"ip":req.connection.remoteAddress,
                "refreshToken": refreshToken,
                "sessionStart": Math.floor(Date.now() / 1000),
                "reLogins": [new Date()]
            }]
        }
    }

    await LoginSessionModel.createLoginSessionDoc(loginSessionDocument)

    //04
    //todo create a long term storage where all last month session which are closed are stored

    //05
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 365*24*60*60*1000),
        domain: '.zurstiege.de'
    });
    res.status(200).json({error: false, tokenData: {accessToken: token, tokenExp: tokenExp, type: req.body.type}, userId: req.body.userId});
};

/**
 * @function (01) find the user via email and check if user exists
 *           (02) check if passwords match
 *           (03) create session sub document id which is part of the session id
 *           (04) set the refresh token as cookie
 *           (05) return the jwt access token and user id
 */
exports.login = async (req, res) => {

    //01
    const userSession = await LoginSessionModel.findByEmail(req.body.email)
    if (!userSession) return res.json({error: true});

    //02
    let passwordFields = userSession.password.split('$');
    let salt = passwordFields[0];
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    if (hash !== passwordFields[1]) return res.json({error: true});

    //03
    let sessionSubId = await LoginSessionModel.createId();
    let payload = {
        userId: userSession.userId,
        type: userSession.type
    };
    if (userSession.type === 'shop') payload['shopId'] = userSession.shopId;

    let token = jwt.sign(payload, env.jwt_access_secret, {expiresIn: env.jwt_exp});
    let tokenExp = Math.floor(Date.now() / 1000) + env.jwt_exp;
    let refreshToken = jwt.sign({"loginSessionId":userSession._id, "loginSessionSubId":sessionSubId, "userId":userSession.userId}, env.jwt_refresh_secret);
    await LoginSessionModel.createSession(userSession._id, {"_id": sessionSubId, "refreshToken": refreshToken, "sessionStart": Math.floor(Date.now() / 1000), "reLogins": [new Date()]})

    //04
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 365*24*60*60*1000),
        domain: '.zurstiege.de'
    });

    //05
    res.status(200).json({error: false, tokenData: {accessToken: token, tokenExp: tokenExp, type: userSession.type}});
};


/**
 * @function (01) check if user has a refresh token set as a cookie and that it is not empty
 *           (02) verify the refresh token and get all components to identify the session
 *           (03) check against revoked session list if this session still active
 *           (04) query for user data and create a new access jwt
 *           (05) return the new access token and if initial refresh is required return user data as well
 */
exports.refreshToken = (req, res) => {
    /*
    //01
    if (!req.cookies.refreshToken) return res.status(403).json({"login_req":true});

    //todo tbd -> generate a new refresh token or so and update the cookie value

    //02
    jwt.verify(req.cookies.refreshToken, env.jwt_refresh_secret, async (err, tokenData) => {
        if (err) return res.status(403).json({"login_req":true});
        //03
        const revoked = await RevokedSessionModel.checkSession(tokenData.loginSessionSubId)
        if (!revoked) {
            //04
            const userData = await UserModel.findId(tokenData.userId);
            let accessToken = jwt.sign({
                userId: userData._id,
            }, env.jwt_access_secret, {expiresIn: env.jwt_exp});
            let tokenExp = Math.floor(Date.now() / 1000) + env.jwt_exp;
            //05
            let dataObj = {"login_req":false, "accessToken":accessToken, "tokenExp":tokenExp};
            if (req.params.type === 'init_refresh') dataObj.userData = userData;
            return res.status(200).json(dataObj);
        } else {
            return res.status(403).json({"login_req":true});
        }
    });
     */
};

/**
 * @function (01) remove the issue and expiration time from the current access token object - otherwise cannot sign the token
 *           (02) sign the token and compute the expiration
 *           (03) return the updated token data
 */
exports.updateToken = (req, res) => {
    //01
    ['iat', 'exp'].forEach(e => delete req.jwt[e]);
    //02
    let updateToken = jwt.sign(req.jwt, env.jwt_access_secret, {expiresIn: env.jwt_exp});
    let tokenExp = Math.floor(Date.now() / 1000) + env.jwt_exp;
    //03
    res.status(200).json({error_code:false, updateToken:updateToken, tokenExp:tokenExp})
};

/**
 * @function (00) parse the token object which contains login session doc and sub doc id
 *           (01) check if token obj has value and exists in database
 *           (02) update the token and set the status to revoked
 *           (03) remove all tokens on the client side so that no further requests are possible
 */
exports.revokeToken = (req, res) => {
    //00

    //01

    //02

    //03
};

/**
 * @function (01) check if refresh token exists - if true verify and get payload
 *           (02) clear the refresh token cookie with the same options as provided in the login
 *           (03) insert session id to the blacklist so that no new access token can be obtained
 *           (04) update the session and set the finish session timestamp - via update service
 *           (05) return no error code
 */
exports.logout = (req, res) => {
    //01
    if (!req.cookies.refreshToken) return res.status(403).json({"error_code":"l_001"});
    jwt.verify(req.cookies.refreshToken, env.jwt_refresh_secret, async (err, tokenData) => {
        if (err) return res.status(403).json({"error_code":"l_002"});
        //02
        res.clearCookie('refreshToken', {httpOnly: true, domain: '.icdcoder.de'});
        //03
        await RevokedSessionModel.revokeSession({"sessionId":tokenData.loginSessionSubId})
        //04
        //await producer.msg('user_update', JSON.stringify({"sessionListId":tokenData.loginSessionId, "sessionId":tokenData.loginSessionSubId, "sessionData":{"revoked":true, "sessionEnd":Math.floor(Date.now()/1000)}}), 'login_session');
        //05
        return res.json({"error_code":false});
    })
};

/**
 * @function (01) remove the session object
 *           (02) todo: place on blacklist
 *           (03) return to gateway
 */
exports.remove = async (req, res) => {
    //01
    await LoginSessionModel.removeById(req.params.userId)
    //todo 02
    //03
    res.json({error_code: false})
};
