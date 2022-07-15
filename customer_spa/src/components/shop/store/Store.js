import React, {useEffect, useState} from "react";
import {getShopDeliveriesAsync, selectStock} from "../../../slice/deliverySlice";
import { useDispatch, useSelector } from "react-redux";

import Navbar from '../../general/navbar/Navbar';
import StoreCreate from "./StoreCreate";
import StoreListItem from "./StoreListItem";

import { errorHandler } from "../../general/error/handler";

import '../../../styles/general/main.css';
import '../../../styles/shop/store.css';

const Store = () => {
    //Dispatch
    const dispatch = useDispatch();
    //Global state variables
    const stockDeliveries = useSelector(selectStock);
    //Local state variables
    const [addViewVisible, setAddViewVisible] = useState(false);

    // Load functions ===================

    /**
     * @function (01) load stored deliveries for this shop
     */
    useEffect(() => {
        dispatch(getShopDeliveriesAsync({index: 0, type: 'shop'}))
            .then((res) => {
                //console.log(res.payload);
            })
            .catch((err) => {
                errorHandler(err, 'failed loading ')
            });
    }, [])

    return (
        <div className="center_container">
            <Navbar />
            <div className="main_center_content_wrapper">
                <div className="main_outer_content">
                    <div className="main_outer_heading">Current stock</div>
                </div>
                <div className="main_center_content main_center_content_top">
                    <div className="order_header">
                        <div className="order_header_section small_order_header_section">Status</div>
                        <div className="order_header_section small_order_header_section">Received</div>
                        <div className="order_header_section small_order_header_section">Type</div>
                        <div className="order_header_section">Receiver name</div>
                        <div className="order_header_section">Receiver address</div>
                        <div className="order_header_section small_order_header_section">ZIP</div>
                        <div className="order_header_section small_order_header_section">Picked up</div>
                    </div>
                    <div className="outbound_table">
                        {
                            stockDeliveries.length > 0 ? (
                                stockDeliveries.map((elem, i) => <StoreListItem data = {elem} addInfo = {() => console.log('hi')} />)
                            ) : (
                                <div className="delivery_empty_result" onClick={() => setAddViewVisible(true)}>You have no packages for pickup - create one if you received something</div>
                            )
                        }
                    </div>

                    { addViewVisible && <StoreCreate hide = {() => setAddViewVisible(false)}/> }
                    <div className="add_delivery_btn" onClick={() => setAddViewVisible(true)}>+</div>
                </div>
                <div className="main_outer_content"></div>
            </div>
        </div>
    );
};

export default Store;
