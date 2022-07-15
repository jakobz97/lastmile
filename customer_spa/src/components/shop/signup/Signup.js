import React, { useState } from "react";
import { Link } from 'react-router-dom';
import {signupShopAsync} from "../../../slice/authSlice";
import {errorHandler} from "../../general/error/handler";

import { useDispatch } from "react-redux";

import { history } from "../../../helpers/history";

import '../../../styles/general/login/login.css';

const SignUpShop = () => {

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    /**
     * @function (01) prevent the default form behaviour and set to loading
     *           (02) dispatch the sign up
     *           (03) redirect based on user type
     */
    const performShopSignup = (e) => {
        //01
        e.preventDefault();
        setLoading(true);

        //02
        dispatch(signupShopAsync({...Object.fromEntries(new FormData(e.target)), ...{type: "shop"}}))
            .then((res) => {
                //03
                if (res.payload.error) return alert('error sign up for store')
                history.push("/store/")
                window.location.reload();
            })
            .catch((err) => {
                setLoading(false);
                errorHandler(err, 'signup error')
            });
    };

    return (
        <div className="login_wrapper">
            <div className="login_section">
                <div className="outer_login_wrapper"></div>

                    <form className="login_field_wrapper" onSubmit={performShopSignup}>
                        <input name="name" className="login_input" placeholder="Shop name" type="text" required/>
                        <div className="login_input login_input_wrapper">
                            <input name="owner_first_name" className="login_input short_login_input" placeholder="First Name" type="text" required/>
                            <input name="owner_last_name" className="login_input short_login_input" placeholder="Last Name" type="text" required/>
                        </div>
                        <input name="email" className="login_input" placeholder="E-Mail" type="email" required/>
                        <input name="password" className="login_input" placeholder="Password" type="password" required/>
                        <div className="login_divider"></div>
                        <input name="address" className="login_input" placeholder="Address" type="text" required/>
                        <div className="login_input login_input_wrapper">
                            <input name="zip" className="login_input short_login_input" placeholder="ZIP" type="text" required/>
                            <input name="city" className="login_input short_login_input" placeholder="City" type="text" required/>
                        </div>
                        <button className="login_btn" type="submit">
                            {loading ? (<span>Processing</span>) : (<span>Sign up</span>)}
                        </button>
                    </form>
                <div className="outer_login_wrapper">
                    <div className="login_legal"><Link className="signup_txt_link" to={"/"}>Imprint</Link>  |  <Link className="signup_txt_link" to={"/"}>Datenschutz</Link>  |  <Link className="signup_txt_link" to={"/"}>AGB</Link>  |  <Link className="signup_txt_link" to={"/"}>Kontakt</Link></div>
                </div>
            </div>
            <div className="login_section">
                Offer your place as a hub and earn money
            </div>
        </div>
    );
};

export default SignUpShop;
