//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const rateLimit = require('../common/middlewares/ratelimit.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch
//Routes
exports.routesConfig = (app) => {

    //Auth functions =========================================================

    /**
     * @function (01) ensure that no jwt was provided and that the login limit is not exceeded by this user
     *           (02) forward to the auth server and check credentials
     *           (03) return the access token and user type
     */
    app.post('/auth/', [
        //01
        ValidationMiddleware.noJwt,
        rateLimit.loginLimit,
        async (req, res) => {
            //02
            let loginData = await fetch('http://localhost:4000/auth/', 'POST', req.body)
            //03
            if (loginData.error) return res.status(400).json(loginData);
            res.status(200).json(loginData);
        }
    ]);

    /**
     * @function (01)
     */
    app.post('/auth/refresh/', [

    ]);

    /**
     * @function (01) ensure that the user has a valid jwt token
     *           (02) invalidate session in the auth server backend
     *           (03) return from gateway to the user
     */
    app.post('/logout/', [
        //01
        //ValidationMiddleware.reqJwt,
        async (req, res) => {
        return res.json({error_code: false})
            //02
            let logoutData = await fetch('http://localhost:4000/auth/logout/', 'POST')
            //03
            res.status(200).json(logoutData);
        }
    ]);


    //Signup / Delete functions =========================================================

    /**
     * @function (01) ensure that no jwt was provided and that the signup limit is not exceeded by this user
     *           (02) create this user on the user server - double check that there is no dupliction
     *           (03) forward to the auth server and create this user
     *           (04) if no error occurred create user inbound parcels
     *           (05) return the access token and basic user data
     */
    app.post('/signup/', [
        //01
        ValidationMiddleware.noJwt,
        rateLimit.signupLimit,
        async (req, res) => {
        //02
            const userData = await fetch('http://localhost:4003/create/', 'POST', req.body)
            //03
            let signupData = await fetch('http://localhost:4000/auth/create/', 'POST', {...req.body, ...{userId: userData._id}})
            if (signupData.error) return res.status(400).json(signupData);
            //04
            await fetch('http://localhost:4001/create/', 'POST', {userId: signupData.userId})
            //05
            res.status(200).json(signupData.tokenData);
        }
    ]);

    /**
     * @function (01) ensure that no jwt was provided and that the signup limit is not exceeded by this user
     *           (02) create this shop in the database
     *           (03) forward to the auth server and create this user if no duplicate exists
     *           (04) create a delivery document for this shop where all entries are stored
     *           (05) return the access token and basic user / shop data
     */
    app.post('/signup/shop/', [
        //01
        ValidationMiddleware.noJwt,
        rateLimit.signupLimit,
        async (req, res) => {
            //02
            const shopData = await fetch('http://localhost:4002/create/', 'POST', req.body)
            //03
            let signupData = await fetch('http://localhost:4000/auth/create/', 'POST', {...req.body, ...{shopId: shopData._id}})
            if (signupData.error) return res.status(400).json(signupData);
            //04
            await fetch('http://localhost:4001/create/shop/', 'POST', {shopId: shopData._id})
            //05
            res.status(200).json(signupData.tokenData);
        }
    ]);

    /**
     * @function (01) Check that the user has a valid json web token
     *           (02) Remove the user from the auth list
     *           (03) Remove the http only cookie
     */
    app.post('/delete/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
            //02
            let removeData = await fetch(`http://localhost:4000/delete/${req.body.userId}`, 'POST', req.body)
            //03

            //
            res.status(200).json(removeData);
        }
    ]);
};
