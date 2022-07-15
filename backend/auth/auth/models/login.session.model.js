const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Login sessions
const loginSessionModel = new Schema({
    email: String,
    password: String,
    userId: Object,
    type: String,
    shopId: Object,
    estOrigin: [String],
    estDeviceType: [String],
    activeSessions:[{
        refreshToken: String,
        sessionStart: Number,
        sessionEnd: Number,
        device: {
            ip: String,
            browser: String,
            os: String,
            lat: String,
            lng: String,
            type: String
        },
        reLogins: [Date],
        revoked: {
            type: Boolean,
            default: false
        }
    }]
});

const LoginSession = mongoose.model('login_sessions', loginSessionModel);

// Setters =========================================================

/**
 * @function create a new login session document
 * @param sessionData which comprises the skeleton
 * @return the created login session document
 */
exports.createLoginSessionDoc = async (sessionData) => {
    const loginSession = new LoginSession(sessionData);
    return loginSession.save();
};

/**
 * @function create a new login session as a sub document
 * @param loginSessionId is the document of the user where all login sessions of the current month are stored
 * @param sessionData which comprises the login session data
 * @return the created login session sub document
 */
exports.createSession = (loginSessionId, sessionData) => {
    return LoginSession.findOneAndUpdate(
        { _id: loginSessionId },
        { $push: { activeSessions: sessionData } }
    )
};

// Getters ===========================================================

/**
 * @function (01) find one entry with respective email
 * @param email provided at the input
 */
exports.findByEmail = (email) => {
    return LoginSession.findOne({email: email});
};

// Remove ===========================================================

/**
 * @function (01) remove login entry by user Id
 * @param userId to identify the user
 */
exports.removeById = (userId) => {
    return LoginSession.deleteMany({userId: userId});
};

// Helper function =============================

/**
 * @function create session id and return it
 */
exports.createId = async () => {
    return mongoose.Types.ObjectId();
};

