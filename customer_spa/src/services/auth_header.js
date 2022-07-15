import axios from "axios";

/**
 * @function (01) parse the user token, expiry and refresh token
 *           (02) if token has expired user refresh token to backend and generate a new access token
 *           (03) create authorization header with Bearer access token and return
 */
export default async function auth_header() {
  //01
  //const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user"));
  //02
  /*if (user.tokenExp < Math.floor(Date.now() / 1000)) {
    const accessData = await axios.post('localhost.../refresh', {
      refreshToken: user.refreshToken,
    });
    if (accessData.data.accessToken) localStorage.setItem("user", JSON.stringify(accessData.data));
  }*/
  //03
  if (token) return { 'Authorization': "Bearer " + token.accessToken, 'Content-Type': 'application/json' };
  return {};
}
