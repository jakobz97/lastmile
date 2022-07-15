import React, {useEffect} from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserType } from "../../../slice/authSlice";

import Tooltip from "./Tooltip";

import '../../../styles/general/navbar/navbar.css';

import logout from '../../../assets/nav/logout.svg';
import delivery from '../../../assets/nav/delivery.svg';


const Navbar = () => {

    const type = useSelector(selectUserType)

    /**
     * @function (01) on render of the component get the current path depending on the path add the active UI class
     */
    useEffect(() => {
        //01
        //document.getElementById(`${window.location.pathname.substring(1)}_nav_item`).classList.add('active_nav_item');
    }, []);

    /**
     * @function (01) get the currently highlighted nav button and remove the highlight
     *           (02) add the highlight to the clicked button
     * @param id of the element where the class is added to
     */
    const changeHighlight = (id) => {
        //01
        //document.getElementsByClassName('active_nav_item')[0].classList.remove('active_nav_item')
        //02
        //document.getElementById(id).classList.add('active_nav_item');
    }

    return (
        <div className="nav_bar">
            <div className="outer_nav_bar">
                <div className="nav_item"></div>
            </div>
            { type === 'user' ?
                <div className="center_nav_bar">
                    <Link to={"/delivery/"} className="nav_item" onClick={() => changeHighlight('income_nav_item')}>
                        <Tooltip content="Send" direction="right">
                            <img src={delivery} className="nav_icon"/>
                        </Tooltip>
                    </Link>
                </div>
                :
                <div className="center_nav_bar">
                    <Link to={"/store/"} className="nav_item" onClick={() => changeHighlight('income_nav_item')}>
                        <Tooltip content="Store" direction="right">
                            <img src={delivery} className="nav_icon"/>
                        </Tooltip>
                    </Link>
                </div>
            }
            <div className="outer_nav_bar">
                <Link to={"/logout"} className="nav_item" onClick={() => changeHighlight('logout_nav_item')}>
                    <Tooltip content="Logout" direction="right">
                        <img src={logout} className="nav_icon" />
                    </Tooltip>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
