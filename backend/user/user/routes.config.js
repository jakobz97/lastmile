const UserMiddleware = require('./middlewares/user.middleware');
const UserController = require('./controllers/user.controller');

exports.routesConfig = (app) => {

    // Setters ====================================

    //Create a new user document
    app.post('/create/', [
        //UserMiddleware.duplicationCheck,
        UserController.createUser
    ]);

    // Getters ====================================

    //Get all users based on name
    app.get('/userName/:name', [
        UserController.findUsers
    ]);

    //Get a specific user information
    app.get('/user/:userId', [
        UserController.getUser
    ]);
};
