import React, {useEffect, useState} from "react";
import Map from '../../general/map/Map';

import { getShopByCity } from "../../../slice/shopSlice";
import { useDispatch } from "react-redux";

import '../../../styles/user/tracking.css';

const ShopFinder = ({hide}) => {

    const dispatch = useDispatch();

    const [zoom, setZoom] = useState(4)
    const [center, setCenter] = useState({lat: 51.165691, lng: 10.451526})
    const [markers, setMarkers] = useState([]);
    const [selectedShop, setSelectedShop] = useState({name: "none selected"});

    /**
     * @function (01) get the dark background, the content wrapper and the inputs
     *           (02) increase the dark background opacity
     *           (03) fade up the content wrapper with an animation
     */
    useEffect(() => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.tracking_wrapper');
        //02
        bg.style.cssText = "opacity: 100%";
        //03
        content.style.marginTop = "0";
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideSearchView = (e, forced) => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.tracking_wrapper');
        //02
        if (!forced && content.contains(e.target)) return;
        //03
        bg.style.cssText = "opacity: 0%";
        content.style.marginTop = "150vh";
        //04
        setTimeout(() => hide(), 350)
    };

    /* ================== */

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
            dispatch(getShopByCity(e.target.value))
                .then((res) => {
                    //02
                    setCenter(res.payload.center)
                    setMarkers(res.payload.shops)
                    setZoom(11)
                })
                .catch((err) => console.log(err, 'error while searching by code'))
        }, 1000);
    }

    return (
        <div className="menu_dark_bg" onClick={hideSearchView}>
            <div className="tracking_wrapper">
                <div className="create_input_hide" onClick={(e) => {hideSearchView(e, true)}}>X</div>
                <input className="search_input" onKeyUp={typeSearchShop} placeholder="Enter your city"/>
                <div className="map_wrapper">
                    <Map markers={markers} center={center} selectedShop={setSelectedShop} zoom={zoom}/>
                </div>
                <div className="selected_shop">Selected shop: {selectedShop.shopName}</div>
            </div>
        </div>
    );
};

export default ShopFinder;
