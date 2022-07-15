import axios from "axios";
import auth_header from "./auth_header";


/**
 * @function (01) check for errors
 *           (02) if no errors occurred return user
 * @param userName string of the name the user desires to search
 */
export const searchByName = (userName) => {
    return axios
        .get(`https://gateway.last-mile-tum.de/users/${userName}`)
        .then((response) => {
            //01
            if (response.data.error) return alert('error');
            //02
            return response.data;
        });
};



