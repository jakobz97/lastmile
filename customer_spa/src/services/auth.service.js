import axios from "axios";
import auth_header from "./auth_header";


/**
 * @function (01) check for errors
 *           (02) add jwt token and expiry time to localstorage
 * @param signupData object containing email, password, first and last name
 */
export const signup = (signupData) => {
    return axios
        .post('https://gateway.last-mile-tum.de/signup/', signupData)
        .then((response) => {
            //01
            if (response.data.error) return alert('error');
            //02
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("type", response.data.type);
                localStorage.setItem("loggedIn", "true");
            }
            return response.data;
        });
};

/**
 * @function (01) check for errors
 *           (02) add jwt token and expiry time to localstorage so that the shop owner can be safely redirected
 * @param signupData object containing email, password, first, last name and shop data
 */
    export const signupShop = (signupData) => {
        return axios
            .post('https://gateway.last-mile-tum.de/signup/shop/', signupData)
            .then((res) => {
                //01
                console.log(res.data);

                if (res.data.error) return alert('error signing up the shop');
                //02
                if (res.data) {
                    localStorage.setItem("user", JSON.stringify(res.data));
                    localStorage.setItem("type", res.data.type);
                    localStorage.setItem("loggedIn", "true");
                }
                return res.data;
            });
};

/**
 * @function (01) set jwt, loggedIn and user type to localstorage
 * @param loginData object containing email, password
 */
export const login = (loginData) => {
    return axios
        .post('https://gateway.last-mile-tum.de/auth/', loginData)
        .then((response) => {
            //01
            if (response.data.tokenData) {
                localStorage.setItem("user", JSON.stringify(response.data.tokenData));
                localStorage.setItem("type", response.data.tokenData.type);
                localStorage.setItem("loggedIn", "true");
            }
            return response.data;
        })
        .catch((err) => {
            console.log('err', err)
        });
};

export const logout = (userId) => {
    //todo: also perform a server side logout by invalidating the session
    localStorage.removeItem("user");
    localStorage.removeItem("type");
    localStorage.setItem("loggedIn", "false");
    return
  return axios
      .post('localhost../logout', userId, { headers: auth_header() })
      .then((response) => {
          localStorage.removeItem("user");
          localStorage.removeItem("type");
          localStorage.setItem("loggedIn", "false");
          return response.data;
      });
};

/**
 * @function (01)
 * @param forgotData email provided by the user
 */
export const forgot = (forgotData) => {
    return axios
        .post('localhost../forgot', forgotData)
        .then((response) => {
            return response.data;
        });
};
