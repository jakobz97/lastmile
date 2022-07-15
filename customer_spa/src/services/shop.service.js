import axios from "axios";
import auth_header from "./auth_header";


/**
 * @function (01) check for errors
 *           (02) if no errors occurred return city lat lng and all shops there
 * @param city string of the city the user desires to search
 */
export const searchByCity = (city) => {
    return axios
        .get(`https://gateway.last-mile-tum.de/shops/${city}`)
        .then((response) => {
            //01
            if (response.data.error) return alert('error');
            //02
            return response.data;
        });
};

/**
 * @function (01) check for errors
 *           (02) if no errors occurred return shop lat lng and all shops there
 * @param shopId string of the city the user desires to search
 */
export const searchShopById = async (shopId) => {
    return axios
        .get(`https://gateway.last-mile-tum.de/shop/${shopId}`, { headers: await auth_header() })
        .then((response) => {
            console.log(response.data)
            //01
            if (response.data.error) return alert('error');
            //02
            return response.data;
        });
};


