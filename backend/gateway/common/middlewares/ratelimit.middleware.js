const rateLimit = require("express-rate-limit");

/**
 * @function limit the login approaches by client to X per hour
 */
exports.loginLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    message: "Too many accounts created from this IP, please try again after an hour"
});

/**
 * @function limit the login approaches by client to X per hour
 */
exports.signupLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    message: "Too many accounts created from this IP, please try again after an hour"
});

/**
 * @function
 */
exports.resetPswLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100,
    message: "Too many accounts created from this IP, please try again after an hour"
});
