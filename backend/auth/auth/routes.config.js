const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthorizationController = require('./controllers/authorization.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
exports.routesConfig = (app) => {

    //Create a new auth document
    app.post('/auth/create/', [
        VerifyUserMiddleware.duplicateUserCheck,
        AuthorizationController.create
    ]);

    //Authenticate user from main login
    app.post('/auth/', [
        AuthorizationController.login
    ]);

    //Authenticate user from main login
    app.post('/logout/', [
        AuthorizationController.logout
    ]);

    //Authenticate user from main login
    app.delete('/remove/:userId', [
        AuthorizationController.remove
    ]);
};
