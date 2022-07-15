//Send email
const sendMail = require('../../common/services/mail.service');

//Email template
const handlebars = require('handlebars');

//Filesystem to load the different templates
const fs = require('fs');
const path = require('path')

/**
 * @function (01) create template with the respective data
 *           (02) send template with email to specific user
 * @param templateName is the relative path to the handlebars template
 * @param data has all data fields to modify the html to match the target - check each template to see which properties are required
 * @param subject is the email subject line
 */
exports.mail = async (templateName, data, subject) => {
    //01
    const template = createTemplate(templateName, data);
    //02
    await sendMail({
        to: data.receiver,
        subject: subject,
        html: template
    });
};

// Helper function ===============================================

/**
 * @function (01) get the template from the file system and compile it using handlebars
 *           (02) return the html template including the correct data provided by the dataObject
 * @param templateName is the relative file path of the template
 * @param dataObject is the data required to fill the template
 */
function createTemplate(templateName, dataObject) {
    //01
    const emailTemplate = fs.readFileSync(path.join(__dirname, templateName), "utf8")
    const template = handlebars.compile(emailTemplate)
    //02
    return template(dataObject)
}


