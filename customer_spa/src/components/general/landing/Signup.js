import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../../../helpers/history";

import Map from '../map/Map';

import { signupAsync } from "../../../slice/authSlice";
import { getShopByCity } from "../../../slice/shopSlice";

import "../../../styles/general/landing/Signup.css"

const Signup = () => {

    const [formStage, setFormStage] = useState(0);
    const [formData, setFormData] = useState({});

    const [selectedShop, setSelectedShop] = useState();
    const [zoom, setZoom] = useState(4)
    const [center, setCenter] = useState({lat: 51.165691, lng: 10.451526})
    const [markers, setMarkers] = useState([]);

    const dispatch = useDispatch();

    //Shop search function ========================================

    /**
     * @function (01) used deferred calling of server to prevent too many requests
     *           (02) check if input has any value - if not return
     *           (03) provide the city to the backend and fetch both city lat lng and all shops in this city
     *           (04) update the local state variables and pass them on to the child component
     */
    let typingTimerSearch;
    const typeSearchShop = (e) => {
        //01
        clearTimeout(typingTimerSearch);
        typingTimerSearch = setTimeout(() => {
            //02
            if (!e.target.value || e.target.value === "") return;
            //03
            searchShop(e.target.value)
        }, 1000);
    }

    /**
     * @function (01) dispatch to backend
     *           (02) set zooms accordingly
     * @param city is the city name in english
     */
    const searchShop = (city) => {
        //01
        dispatch(getShopByCity(city))
            .then((res) => {
                //02
                setCenter(res.payload.center)
                setMarkers(res.payload.shops)
                setZoom(11)
            })
            .catch((err) => console.log(err, 'error while searching by code'))
    }

    //Form submit function ========================================

    const submitForm = (e, stage) => {
        //01
        e.preventDefault();
        //02
        let signupData = Object.fromEntries(new FormData(e.target));
        //03
        setFormData({...formData, ...signupData})
        //04
        e.target.reset();
        if (stage === 1) searchShop(signupData.city)
        setFormStage(stage+1)
    }

    /**
     * @function (01) double check that the user has selected a signup
     *           (03) combine the selected signup and the signup data -> dispatch to the signup reducer and wait until fulfilled
     */
    const performSignup = () => {
        //01
        if (!selectedShop) return alert('error message because no signup was selected')
        //02
        dispatch(signupAsync({...formData, ...selectedShop, ...{type: "user"}}))
            .then((res) => {
                history.push("/delivery/")
                window.location.reload();
            })
            .catch((err) => {
                console.log(err)
            });
    };

    // =================================

    return (
        <div className="main_section right_main_section">
            <div id="cta_wrapper">
                { formStage === 0 ? (
                    <form className="su_section" onSubmit={(e) => submitForm(e, 0)}>
                        <input className="signup_input short_input" name="firstName" placeholder="First name" type="text" required />
                        <input className="signup_input short_input" name="lastName" placeholder="Last name" type="text" required />
                        <input className="signup_input" name="email" placeholder="E-Mail" type="email" required />
                        <input className="signup_input" name="password" placeholder="Password" type="password" required/>
                        <button type="submit" className="signup_input signup_btn">Add your address</button>
                    </form>
                ) : formStage === 1 ? (
                    <form className="su_section" onSubmit={(e) => submitForm(e, 1)}>
                        <input className="signup_input" name="address" placeholder="Address" type="text" required />
                        <input className="signup_input short_input" name="zip" placeholder="ZIP" type="text" required />
                        <input className="signup_input short_input" name="city" placeholder="City" type="text" required />
                        <input className="signup_input" name="country" placeholder="Country" type="text" required />
                        <button type="submit" className="signup_input signup_btn">Find a shop nearby</button>
                    </form>
                ) : (
                    <div className="su_section">
                        <div className="su_heading_wrapper">
                            <div className="su_heading">{!selectedShop ? 'Select a shop' : 'Selected: '+selectedShop.shopName}</div>
                            <div className="su_heading" onClick={() => setFormStage(true)}>back</div>
                        </div>
                        <input className="signup_input" placeholder="Your city" type="text" onKeyUp={(e) => typeSearchShop(e)}/>
                        <Map markers={markers} center={center} selectedShop={setSelectedShop} zoom={zoom}/>
                        <button type="submit" className="signup_input signup_btn" onClick={performSignup}>Sign up</button>
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Signup;
