import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import {errorHandler} from "../../general/error/handler";

import {getUserByName} from "../../../slice/userSlice";
import {createStockAsync} from "../../../slice/deliverySlice";

import '../../../styles/general/create/create.css';

const StoreCreate = ({ hide }) => {

    const dispatch = useDispatch();
    const [recipientOptions, setRecipientOptions] = useState([]);
    const [recipientData, setRecipientData] = useState({
        city: "",
        zip: "",
        userId: ""
    });

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
     *           (02) XXX
     */
    const handleSubmit = (e) => {
        //01
        e.preventDefault();
        //02
        let submitData = {...Object.fromEntries(new FormData(e.target)), ...recipientData};
        //03
        dispatch(createStockAsync(submitData))
            .then((res) => {
                //04
                hideCreateView(e, true)
            })
            .catch((err) => errorHandler(err, 'could not create the delivery'))
    }

    /**
     * @function (01) implement the timeout functionality
     *           (02) dispatch the name to the backend and wait for responses
     *           (03) assign responses to the local state over which is iterated
     */
    let typingTimerSearch;
    const searchUser = (e) => {
        clearTimeout(typingTimerSearch);
        typingTimerSearch = setTimeout(() => {
            //02
            if (!e.target.value || e.target.value === "") return;
            //03
            dispatch(getUserByName(e.target.value))
                .then((res) => {
                    //04
                    setRecipientOptions(res.payload.userData)
                })
                .catch((err) => console.log(err, 'error while searching by name'))
        }, 1000);
    }

    /**
     * @function (01) set the selected user data
     *           (02) empty the possible options to ensure that the field is hidden again
     * @param userData is the entire user object including id and name
     */
    const selectUser = (userData) => {
        //01
        setRecipientData(userData);
        //02
        setRecipientOptions([]);
    }

    return (
        <div className="menu_dark_bg" onClick={hideCreateView}>
            <form className="create_input_wrapper large_create_input_wrapper" onSubmit={(e) => handleSubmit(e)}>
                <div className="create_input_hide" onClick={(e) => {hideCreateView(e, true)}}>X</div>
                <input name="name" className="create_input highlighted_create_input" type="text" onKeyUp={searchUser} placeholder="Enter recipient name" />
                { recipientOptions.length > 0 &&
                    <div className="create_result_wrapper">
                        {recipientOptions.map((data, index) => {
                            return <div className="create_result_row" onClick={() => selectUser(data)}>
                                <div className="create_result_item">{data.name}</div>
                                <div className="create_result_item">{data.address + ", " + data.zip + " "+ data.city}</div>
                            </div>
                        })}
                    </div>
                }
                <div className="internal_create_input_wrapper">
                    <input className="create_input short_create_input disabled_input" placeholder="ZIP" value={recipientData.zip} disabled />
                    <input className="create_input disabled_input" placeholder="City" value={recipientData.city} disabled />
                </div>
                <div className="create_separator"></div>
                <div className="internal_create_input_wrapper">
                    <input type="radio" name="package_type" value="letter" id="letter_btn" className="input_radio_btn" />
                    <label htmlFor="letter_btn" className="input_radio_btn_label">Letter</label>
                    <input type="radio" name="package_type" value="parcel" id="parcel_btn" className="input_radio_btn" />
                    <label htmlFor="parcel_btn" className="input_radio_btn_label">Parcel</label>
                    <input type="radio" name="package_type" value="bulk" id="bulk_btn" className="input_radio_btn" />
                    <label htmlFor="bulk_btn" className="input_radio_btn_label">Bulk</label>
                </div>
                <div className="create_separator"></div>
                <input name="sName" className="create_input" type="text" placeholder="Sender name" />
                <input name="sAddress" className="create_input" type="text" placeholder="Sender address" />
                <div className="internal_create_input_wrapper">
                    <input name="sZIP" className="create_input short_create_input" type="text" placeholder="Sender ZIP" />
                    <input name="sCity" className="create_input" type="text" placeholder="Sender city" />
                </div>
                <div className="create_separator"></div>
                <button className="create_submit">Upload package to system</button>
            </form>
        </div>
    );
};

export default StoreCreate;
