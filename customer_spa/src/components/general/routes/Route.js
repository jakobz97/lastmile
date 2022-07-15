import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route} from "react-router-dom";

//general routes
import LandingPage from "../landing/Landing";
import Login from "../login/Login";
import Logout from "../logout/Logout";

//User routes
import Delivery from "../../user/delivery/Delivery";

//Shop routes
import ShopSignUp from "../../shop/signup/Signup";
import ShopStore from "../../shop/store/Store";

import {selectIsLoggedIn, selectUserType} from "../../../slice/authSlice";


function Routes() {
    /**
     * @desc (01) check from redux if the user is logged in
     *       (02) if user is logged in redirect to the specific user type
     */
    const loggedIn = useSelector(selectIsLoggedIn);
    const userType = useSelector(selectUserType);

    /**
     * @desc return the available routes based on the current user status - logged in or not logged in
     */
    return (
        <>
            {loggedIn && userType === 'user' ? (
                <Switch>
                    <Route exact path="/logout" component={Logout}/>
                    <Route exact path="/delivery" component={Delivery} />
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup/shop" component={ShopSignUp} />
                </Switch>
            ) : loggedIn && userType === 'shop' ? (
                <Switch>
                    <Route exact path="/logout" component={Logout} />
                    <Route exact path="/store" component={ShopStore} />
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup/shop" component={ShopSignUp} />
                </Switch>
            ) : (
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup/shop" component={ShopSignUp} />
                </Switch>
            )}
        </>
    );
}

export default Routes;








