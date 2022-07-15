import React from "react";
import {Link} from 'react-router-dom';

import SignUp from './Signup';

import "../../../styles/general/landing/Landing.css";

const LandingPage = () => {

    return (
        <div className="landing_wrapper">
            <div id="navbar">
                <div id="logo_wrapper">
                </div>
                <div id="right_navbar">
                    <Link to={"/signup/shop"} class="navbar_link">Create a shop</Link>
                    <Link to={"/login"} class="navbar_link active_link">Log in</Link>
                </div>
            </div>
            <div id="main">
                <div className="main_section">
                    <p id="main_txt">Last mile</p>
                    <p id="main_sub_text">Never queue again in front of the post office</p>
                </div>
                <SignUp />
            </div>
            <div id="solution"></div>
        </div>

    );
};

export default LandingPage;
