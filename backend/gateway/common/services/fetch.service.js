const axios = require('axios');

/**
 * @function (01) try catch block
 *           (02) fetch with parameters and return
 * @param src of the microservice including route
 * @param method different REST methods
 * @param body JSON serialised data
 */
exports.fetch = async (src, method, body) => {
    //01
    try {
        //02
        const res = await axios({
                method: method,
                url: src,
                data: body
            });
        return res.data;
    } catch (e) {
        return e;
    }
}
