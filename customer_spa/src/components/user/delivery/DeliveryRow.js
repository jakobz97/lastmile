import React from "react";

import '../../../styles/user/row.css';
import location from '../../../assets/general/placeholder.svg';
import more from '../../../assets/general/dots.svg';

const DeliveryRow = ({ data, addInfo }) => {

    /**
     * @function (01)
     */
    const addInteraction = () => {
        alert("Work in progress - let others pick up, send back")
    }

    return (
        <div className="outbound_list_item">
            <div className="order_row_section small_order_row_section">{data.status}</div>
            <div className="order_row_section small_order_row_section">{new Date((data.timestamp*1000)).toLocaleString('de-DE', { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}</div>
            <div className="order_row_section small_order_row_section">{data.package_type}</div>
            <div className="order_row_section">{data.sName}</div>
            <div className="order_row_section">{data.sAddress}</div>
            <div className="order_row_section small_order_row_section" onClick={addInfo}>
                <img src={location} className="order_row_icon"/>
            </div>
            <div className="order_row_section small_order_row_section" onClick={addInteraction}>
                <img src={more} className="order_row_icon"/>
            </div>
        </div>
    );
};

export default DeliveryRow;
