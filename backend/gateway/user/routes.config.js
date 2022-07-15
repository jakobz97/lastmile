
//Services
const fetch = require('../common/services/fetch.service').fetch
//Routes
exports.routesConfig = (app) => {

    // Getter functions =======================================

    /**
     * @function (01) forward to the user server and get limited information back
     *           (02) return the user data
     */
    app.get('/users/:name', [
        //01
        async (req, res) => {
            //02
            let userData = await fetch(`http://localhost:4003/userName/${req.params.name}`, 'GET')
            //03
            if (userData.error) return res.status(400).json(userData);
            res.status(200).json(userData);
        }
    ]);

};
