import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { loginAsync, forgotAsync } from "../../../slice/authSlice";
import {errorHandler} from "../error/handler";

import { useDispatch } from "react-redux";

import { history } from "../../../helpers/history";

import '../../../styles/general/login/login.css';

const Login = () => {

    const [forgotPsw, setForgotPsw] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    /**
     * @function (01) prevent the default form behaviour and set to loading
     *           (02) dispatch the login
     *           (03) check if any errors occurred during login
     *           (04) redirect based on account type - shop or user
     */
    const performLogin = (e) => {
        //01
        e.preventDefault();
        setLoading(true);
        //02
        dispatch(loginAsync(Object.fromEntries(new FormData(e.target))))
            .then((res) => {
                //03
                if (res.payload.error) return alert('error log in')
                //04
                res.payload.tokenData.type === 'user' ? history.push("/delivery/") : history.push("/store/");
                window.location.reload();
            })
            .catch((err) => {
                setLoading(false);
                errorHandler(err, 'login error')
            });
    };

    /**
     * @function (01) prevent default and show loading symbol
     *           (02) dispatch the forgot password request to the backend
     *           (03) indicate that the request was successful
     */
    const performForgotPsw = (e) => {
        //01
        e.preventDefault();
        setLoading(true);
        //02
        dispatch(forgotAsync(Object.fromEntries(new FormData(e.target))))
            .then((res) => {
                //03
                alert('if we have found a matching email - you will user one')
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }


    return (
        <div className="login_wrapper">
            <div className="login_section">
                <div className="outer_login_wrapper"></div>
                {!forgotPsw ? (
                    <form className="login_field_wrapper" onSubmit={performLogin}>
                        <input name="email" className="login_input" placeholder="E-Mail" type="email" required/>
                        <input name="password" className="login_input" placeholder="Password" type="password" required/>
                        <button className="login_btn" type="submit">
                            {loading ? (<span>Processing</span>) : (<span>Login</span>)}
                        </button>
                        {/*<div className="login_btn forgot_btn" onClick={() => {setForgotPsw(true)}}>Forgot password</div>*/}
                    </form>
                ) : (
                    <form className="login_field_wrapper" onSubmit={performForgotPsw}>
                        <input name="email" className="login_input" placeholder="E-Mail" type="email" required />
                        <button className="login_btn" type="submit">
                            {loading ? (<span>Processing</span>) : (<span>Reset password</span>)}
                        </button>
                        <div className="login_btn forgot_btn" onClick={() => {setForgotPsw(false)}}>Back</div>
                    </form>
                )}
                <div className="outer_login_wrapper">
                    <div className="login_legal"><Link className="signup_txt_link" to={"/"}>Imprint</Link>  |  <Link className="signup_txt_link" to={"/"}>Datenschutz</Link>  |  <Link className="signup_txt_link" to={"/"}>AGB</Link>  |  <Link className="signup_txt_link" to={"/"}>Kontakt</Link></div>
                </div>
            </div>
            <div className="login_section">
                Log in to the seamless delivery solution
            </div>
        </div>
    );
};

export default Login;
