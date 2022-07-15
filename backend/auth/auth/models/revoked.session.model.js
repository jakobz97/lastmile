const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Revoked sessions - todo make this global as this has to be queried from any server
const revokedSessionModel = new Schema({
    sessionId: Object
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});

const RevokedSessions = mongoose.model('revoked_sessions', revokedSessionModel);

/**
 * @function insert the session on the blacklist so that it is not renewed
 * @param sessionData which comprises the skeleton of the revoked session
 * @return the created revoked session document
 */
exports.revokeSession = async (sessionData) => {
    const revokeSession = new RevokedSessions(sessionData);
    return revokeSession.save();
};

/**
 * @function (01) find eventual session by id
 * @param sessionId of the session to check against blacklist
 */
exports.checkSession = async (sessionId) => {
    return RevokedSessions.findOne({sessionId: sessionId});
};
