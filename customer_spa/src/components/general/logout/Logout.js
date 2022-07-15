import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {errorHandler} from "../error/handler";

import {logoutAsync} from "../../../slice/authSlice";

import {history} from "../../../helpers/history";

import '../../../styles/general/logout/logout.css';

const Logout = () => {

    const dispatch = useDispatch();

    /**
     * @function (01) dispatch the logout to the backend
     *           (02) on success redirect to the landing page again
     */
    useEffect(() => {
        //01
        dispatch(logoutAsync())
            .then((res) => {
                //02
                history.push("/");
                window.location.reload();
            })
            .catch((err) => errorHandler(err, 'Could not log out'))
    }, [])

    return (
        <div className="logout_container">
            You are safely being logged out...
        </div>
    );
};

export default Logout;
