//Security layers
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const rateLimit = require('../common/middlewares/ratelimit.middleware');

//Services
const fetch = require('../common/services/fetch.service').fetch
//Routes
exports.routesConfig = (app) => {

    // Setter functions =======================================

    /**
     * @function (01) forward to the shop server and create the shop
     *           (02) return the shop data
     */
    app.post('/shop/', [
        //01
        async (req, res) => {
            //02
            let shopData = await fetch('http://localhost:4002/shop/', 'POST', req.body)
            //03
            if (shopData.error) return res.status(400).json(shopData);
            res.status(200).json(shopData);
        }
    ]);

    // Getter functions =======================================

    /**
     * @function (01) forward to the shop server and get limited information back
     *           (02) return the shop data
     */
    app.get('/shops/:city', [
        //01
        async (req, res) => {
            //02
            let shopData = await fetch(`http://localhost:4002/shops/${req.params.city}`, 'GET')
            //03
            if (shopData.error) return res.status(400).json(shopData);
            res.status(200).json(shopData);
        }
    ]);

    /**
     * @function (00) security checks
     *           (01) forward to the shop server and get limited information back
     *           (02) return the shop data
     */
    app.get('/shop/:shopId', [
        //00
        ValidationMiddleware.reqJwt,
        PermissionMiddleware.reqUser,
        //01
        async (req, res) => {
            //02
            let shopData = await fetch(`http://localhost:4002/shop/${req.params.shopId}`, 'GET')
            //03
            if (shopData.error) return res.status(400).json(shopData);
            res.status(200).json(shopData);
        }
    ]);






};
