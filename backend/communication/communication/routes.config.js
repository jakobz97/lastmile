/**
 * All share function controllers
 */
const MailController = require('./controllers/mail.controller');
//const PhoneController = require('./controllers/phone.controller');

exports.routesConfig = (app) => {

    app.post('/mail/notification/', [
        async (req, res) => {
        await MailController.mail('../../common/templates/notification/notification.hbs', {
            senderName: req.body.senderName,
            firstName: req.body.firstName,
            verifyLink: req.body.verifyLink,
            receiver: req.body.email
            }, `You received a new delivery`)

            res.json({error: false});
        }
    ]);
};

