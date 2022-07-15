//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch

exports.routesConfig = (app) => {

    //Setters ==================================================

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) proceed to delivery server where the delivery is created for both the shop and the receiver
     *           (03) create outbound communication
     *           (04) return the success/error and the shop stock data to update the state
     */
    app.post('/delivery/shop/', [
        //01
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqShop,
        //02
        async (req, res) => {
            let stockData = await fetch('http://localhost:4001/create/shop/delivery/', 'POST', {...req.body, ...{shopId: req.jwt.shopId}})
            //03
            await fetch('http://localhost:4004/mail/notification/', 'POST', {
                senderName:req.body.sName,
                firstName:req.body.name,
                verifyLink:'https://werder.de',
                email:req.body.email,
            })
            //04
            res.json(stockData)
        }
    ]);

    // Getters ========================================

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) get all deliveries of this user - including pagination
     */
    app.get('/deliveries/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
        console.log(req.jwt);
            //02
            const deliveryData = await fetch(`http://localhost:4001/deliveries/${req.jwt.userId}`, 'GET')
            //04
            res.json(deliveryData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) get all deliveries of this shop - including pagination
     */
    app.get('/deliveries/shop/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
            //02
            const deliveryData = await fetch(`http://localhost:4001/deliveries/shop/${req.jwt.shopId}`, 'GET')
            //04
            res.json(deliveryData)
        }
    ]);

    /**
     * @function (01) ensure that the user is logged in and provides a valid jwt
     *           (02) get a specific deliveries location
     */
    app.get('/delivery/', [
        //01
        ValidationMiddleware.reqJwt,
        async (req, res) => {
            //02
            const deliveryData = await fetch(`http://localhost:4001/deliveries/?userId=${req.jwt.userId}`, 'GET')
            //04
            res.json(deliveryData)
        }
    ]);

    // Patches =============================================

    /**
     * @function (01) ensure that the user is logged in
     */
    app.patch('/delivery/', [
        //01
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqShop,
        async (req, res) => {
            //02
            await fetch(`http://localhost:4001/delivery/`, 'PATCH', {...req.body, ...{shopId: req.jwt.shopId}})
            //04
            res.json({documentId: req.body._id})
        }
    ]);

};
