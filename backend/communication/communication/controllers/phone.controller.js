//Env variables
const config = require('../../common/config/env.config')

//Get twilio
const twilio = require('twilio');
const client = new twilio(config.twilio_account_id, config.twilio_auth_token);

//Blacklist model
const Blacklist = require('../models/blacklist.model')

// Functions =============================

/**
 * @function (01) check if this phone number is on the blacklist
 *           (02) modify the sms text
 *           (03) send the sms via twilio
 * @param phoneData has all data to send the sms
 */
exports.sharePhone = async (phoneData) => {
    //01
    if (await blacklistCheck()) return;
    //02
    let sms = `Hi das ist ein Test für Twilio`;
    //03
    client.messages.create({
        body: sms,
        to: '+4917622577088',  // Text this number
        from: config.twilio_phone_number // From a valid Twilio number
    })
        .then((r) => {

        })
        .catch((e) => {

        })
};

//Helper function

/**
 * @function (01) check if this phone number value returns null
 *           (02) if not check if this user has a general block - continue
 *           (03) if phone owner has a specific block check if this user was specifically blocked
 *           (04) all blacklist tests passed send sms
 * @param val is the phone number
 * @param senderId is the user id of the sender
 */
async function blacklistCheck(val, senderId) {
    //01
    const phoneBlacklist = Blacklist.findPhoneBlacklist(val);
    if (!phoneBlacklist) return false;
    //02
    if (phoneBlacklist.generalBlock) return true;
    //03
    if (phoneBlacklist.specificBlock.includes(senderId)) return true;
    //04
    return false;
}






