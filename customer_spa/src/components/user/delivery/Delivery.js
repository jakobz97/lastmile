import React, {useEffect, useState} from "react";
import {getDeliveriesAsync, selectInbounds, selectOutbounds} from "../../../slice/deliverySlice";
import { useDispatch, useSelector } from "react-redux";

import Navbar from '../../general/navbar/Navbar';
import DeliveryListItem from "./DeliveryRow";
import DeliveryCreate from "./DeliveryCreate";
import TrackingView from '../../general/map/TrackingView';
import ShopFinderView from '../finder/ShopFinder';

import { errorHandler } from "../../general/error/handler";

import '../../../styles/general/main.css';
import '../../../styles/user/delivery.css';

const Delivery = () => {
    //Dispatch
    const dispatch = useDispatch();
    //Global state variables
    const inboundDeliveries = useSelector(selectInbounds);
    const outboundDeliveries = useSelector(selectOutbounds);
    //Local state variables
    const [inboundViewVisible, setInboundViewVisible] = useState(true);
    const [trackingViewVisible, setTrackingViewVisible] = useState(false);
    const [trackingViewData, setTrackingViewData] = useState(false);
    const [shopFinderVisible, setShopFinderVisible] = useState(false);
    const [addViewVisible, setAddViewVisible] = useState(false);

    // Load functions ===================

    /**
     * @function (01) load inbound and outbound deliveries
     */
    useEffect(() => {
        dispatch(getDeliveriesAsync({index: 0, type: 'user'}))
            .then((res) => {
                //03
                console.log(res.payload)
            })
            .catch((err) => {
                errorHandler(err, 'failed loading ')
            });
    }, [])

    // Show hide functions ===================

    /**
     * @function (01) update local state variable where this becomes visible
     *           (02) update local state variable with all the content
     */
    const showTrackingView = (data) => {
        //01
        setTrackingViewVisible(true);
        //02
        setTrackingViewData(data)
    };

    /**
     * @function (01)
     */
    const openShopFinder = () => {
        //01
        setTrackingViewVisible(true);

    }

    // JSX ===================

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Deliveries</div>
                    <div className="main_outer_switch_wrapper">
                        <div className={`main_outer_btn selected_main_outer_btn`} onClick={() => {setShopFinderVisible(true)}}>Shop finder</div>
                        {/*
                            <div className={`main_outer_btn ${inboundViewVisible && "selected_main_outer_btn"}`}
                                 onClick={() => {
                                     setInboundViewVisible(true)
                                 }}>Inbound</div>
                            <div className={`main_outer_btn ${!inboundViewVisible && "selected_main_outer_btn"}`} onClick={() => {setInboundViewVisible(false)}}>Outbound</div>
                        */}
                    </div>
                </div>
                <div className="main_center_content main_center_content_top">
                    <div className="order_header">
                        <div className="order_header_section small_order_header_section">Status</div>
                        <div className="order_header_section small_order_header_section">Received</div>
                        <div className="order_header_section small_order_header_section">Type</div>
                        <div className="order_header_section">Sender name</div>
                        <div className="order_header_section">Sender address</div>
                        <div className="order_header_section small_order_header_section">Store</div>
                        <div className="order_header_section small_order_header_section">More</div>
                    </div>
                    <div className="outbound_table">
                        {
                            inboundDeliveries.length > 0 ? (
                                inboundDeliveries.map((elem, i) => <DeliveryListItem data = {elem} addInfo = {() => showTrackingView(elem)} />)
                            ) : (
                                <div className="delivery_empty_result">No inbound deliveries - you will get notified once a package arrives</div>
                            )
                        }
                    </div>
                    { shopFinderVisible && <ShopFinderView hide = {() => setShopFinderVisible(false)}/> }
                    { trackingViewVisible && <TrackingView data = {trackingViewData} hide = {() => setTrackingViewVisible(false)}/> }
                    { addViewVisible && <DeliveryCreate hide = {() => setAddViewVisible(false)}/> }
                    { !inboundViewVisible && <div className="add_delivery_btn" onClick={() => setAddViewVisible(true)}>+</div> }
                </div>
                <div className="main_outer_content"></div>
            </div>
        </div>
    );
};

export default Delivery;
