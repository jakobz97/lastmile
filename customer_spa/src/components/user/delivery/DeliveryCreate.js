import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import {errorHandler} from "../../general/error/handler";

import {createOutboundAsync} from "../../../slice/deliverySlice";

import '../../../styles/general/create/create.css';

const DeliveryCreate = ({ hide }) => {

    const dispatch = useDispatch();

    /**
     * @function (01) get the dark background, the content wrapper and the inputs
     *           (02) increase the dark background opacity
     *           (03) fade up the content wrapper with an animation and set focus on the input
     */
    useEffect(() => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper'),
            input = document.querySelector('.create_input');
        //02
        bg.style.cssText = "opacity: 100%";
        //03
        content.style.marginTop = "0";
        setTimeout(() => {
            input.focus()
        }, 350)
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideCreateView = (e, forced) => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.create_input_wrapper');
        //02
        if (!forced && content.contains(e.target)) return;
        //03
        bg.style.cssText = "opacity: 0%";
        content.style.marginTop = "150vh";
        //04
        setTimeout(() => hide(), 350)
    };

    // ===========================================================

    /**
     * @function (01) prevent default behaviour of the form
     *           (02) dispatch the converted form to object to backend and wait for response
     *           (03) hide the create view and let redux update the outbound deliveries
     */
    const handleSubmit = (e) => {
        //01
        e.preventDefault();
        return alert("currently working on this feature")
        //02
        dispatch(createOutboundAsync(Object.fromEntries(new FormData(e.target))))
            .then((res) => {
                //03
                hideCreateView(e, true)
            })
            .catch((err) => errorHandler(err, 'could not create the outbound user'))
    }

    return (
        <div className="menu_dark_bg" onClick={hideCreateView}>
            <form className="create_input_wrapper" onSubmit={(e) => handleSubmit(e)}>
                <div className="create_input_hide" onClick={(e) => {hideCreateView(e, true)}}>X</div>
                <input name="name" className="create_input" type="text" placeholder="Name" required />
                <div className="internal_create_input_wrapper">
                    <input name="address" className="create_input" type="text" placeholder="Address" required />
                    <input name="zip" className="create_input short_create_input" type="text" placeholder="ZIP" required />
                </div>
                <input name="email" className="create_input" type="email" placeholder="Email" required />
                <button className="create_submit">Request rider</button>
            </form>
        </div>
    );
};

export default DeliveryCreate;
