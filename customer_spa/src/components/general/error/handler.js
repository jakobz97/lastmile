/**
 * @function (01) alert that an error happened
 *           (02) log the error to the console
 * @param err is the error thrown
 * @param msg custom message
 */
export const errorHandler = (err, msg) => {
    //01
    alert(`${msg} - find more information in the console`)
    //02
    console.log('err', err)
}
