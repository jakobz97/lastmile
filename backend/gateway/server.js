const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Restrict incoming requests
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    return req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

//Parsing of body in json / form data and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Require all routes
const AuthRouter = require('./auth/routes.config');
const DeliveryRouter = require('./delivery/routes.config');
const ShopRouter = require('./shop/routes.config');
const UserRouter = require('./user/routes.config');

//Add routes for auth, user and admin interactions
AuthRouter.routesConfig(app);
DeliveryRouter.routesConfig(app);
ShopRouter.routesConfig(app);
UserRouter.routesConfig(app);

app.listen(config.port, () => {
    console.log('app listening at port %s', config.port);
});


