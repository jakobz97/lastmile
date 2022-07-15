import React, {useEffect, useState} from "react";
import Map from './Map';

import { getShop } from "../../../slice/shopSlice";
import { useDispatch } from "react-redux";

import '../../../styles/user/tracking.css';

const TrackingView = ({data, hide}) => {

    const dispatch = useDispatch();
    const [shopData, setShopData] = useState({});

    /**
     * @function (01) get the dark background, the content wrapper and the inputs
     *           (02) increase the dark background opacity
     *           (03) fade up the content wrapper with an animation
     *           (04) load additional content - especially current lat lng if the rider has picked up the parcel
     */
    useEffect(() => {
        //01
        let bg = document.querySelector('.menu_dark_bg'),
            content = document.querySelector('.tracking_wrapper');
        //02
        bg.style.cssText = "opacity: 100%";
        //03
        content.style.marginTop = "0";
        //04
        getShopInfo()
    }, [])

    /**
     * @function (01) get the background and content
     *           (02) return if user clicked on the content
     *           (03) user clicked outside of content - hide
     *           (04) after timeout set state again to hidden
     */
    const hideTrackingView = (e, forced) => {
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
     * @function (01) dispatch to backend to get the detailed information on the shop
     *           (02) update the state linked to the map
     */
    const getShopInfo = () => {
        //01
        dispatch((getShop(data.shopId)))
            .then((res) => {
                //02
                setShopData(res.payload)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="menu_dark_bg" onClick={hideTrackingView}>
            <div className="tracking_wrapper">
                <div className="create_input_hide" onClick={(e) => {hideTrackingView(e, true)}}>X</div>
                <div className="tracking_desc">{shopData.name}</div>
                <div className="tracking_desc lower_tracking_desc">{shopData.address}</div>
                <div className="map_wrapper">
                    <Map markers={[{lat:shopData.lat, lng:shopData.lng}]} center={{lat: shopData.lat, lng: shopData.lng}} selectedShop={() => console.log("do nothing")} zoom={13}/>
                </div>
            </div>
        </div>
    );
};

export default TrackingView;
