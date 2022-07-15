const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Mail blacklist
const mailBlacklistSchema = new Schema({
    val: String,
    generalBlock: {
        type: Boolean,
        default: false
    },
    editLink: {
        hash: String,
        expiryTimestamp: Number
    },
    specificBlock: [String]
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});
mailBlacklistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
mailBlacklistSchema.set('toJSON', {
    virtuals: true
});
mailBlacklistSchema.findById = function (cb) {
    return this.model('MailBlacklist').find({id: this.id}, cb);
};
const MailBlacklist = mongoose.model('MailBlacklist', mailBlacklistSchema);

//Phone blacklist
const phoneBlacklistSchema = new Schema({
    val: String,
    generalBlock: {
        type: Boolean,
        default: false
    },
    editLink: {
        hash: String,
        expiryTimestamp: Number
    },
    specificBlock: [String]
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
});
phoneBlacklistSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
phoneBlacklistSchema.set('toJSON', {
    virtuals: true
});
phoneBlacklistSchema.findById = function (cb) {
    return this.model('PhoneBlacklist').find({id: this.id}, cb);
};
const PhoneBlacklist = mongoose.model('PhoneBlacklist', phoneBlacklistSchema);

//todo: Online user internal blacklist -> for each user a document with sub documents of communication who are blocked from accessing any data from this user


/**
 * @function (01) find via mail
 * @param email is the value checked for its existence
 */
exports.findMailBlacklist = (email) => {
    MailBlacklist.findOne({val: email})
        .then((r) => {
            return r;
        })
        .catch((e) =>{

        });
};

// ========================================

/**
 * @function (01) find via phone
 * @param phone is the value checked for its existence
 */
exports.findPhoneBlacklist = (phone) => {
    return PhoneBlacklist.findOne({val: phone});
};
