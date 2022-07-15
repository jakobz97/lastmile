const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//Login sessions
const userModel = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    zip: String,
    city: String,
    country: String,
    schedule: Object,
    selectedShop: Object,
});

const User = mongoose.model('user', userModel);

// Setters =========================================================

/**
 * @function create a new user document
 * @param userData which comprises the skeleton
 * @return the created user document
 */
exports.createUser = async (userData) => {
    const user = new User(userData);
    return user.save();
};

// Getters ===========================================================

/**
 * @function (01) find one entry via user id
 * @param userId provided to find the user
 */
exports.findByUserId = (userId) => {
    return User.findById(userId);
};

/**
 * @function (01) find multiple users via their name and return them
 * @param name provided to find all users with a similar name
 */
exports.findByAggregatedName = (name) => {
    //01
    return User.aggregate([
        {$project:{name: { $concat : [ "$firstName", " ", "$lastName" ] }, address:"$address", zip:"$zip", city:"$city", userId:"$_id", email:"$email"}},
        {$match : { name: { $regex: name, $options:'i'}}}
    ]);
};

// Remove ===========================================================

/**
 * @function (01) remove user doc
 * @param userId to identify the user
 */
exports.removeById = (userId) => {
    return User.deleteMany({_id: userId});
};
