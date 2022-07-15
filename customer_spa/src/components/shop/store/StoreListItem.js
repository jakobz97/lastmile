import React from "react";

import {updateStockAsync} from "../../../slice/deliverySlice";
import {errorHandler} from "../../general/error/handler";
import {useDispatch} from "react-redux";

import check from '../../../assets/general/check.svg';

const StoreListItem = ({ data }) => {

    console.log(data);

    const dispatch = useDispatch();

    /**
     * @function (01) dispatch this to the backend and update the state in redux
     */
    const pickedUp = () => {
        //01
        dispatch(updateStockAsync(data))
            .then((res) => {
                console.log(res.payload);
            })
            .catch((err) => errorHandler(err, 'could not create the delivery'))

    }

    //check if timePickedUp is set -> then it is picked up and the button should no longer be visible
    return (
        <div className="outbound_list_item">
            <div className="order_row_section small_order_row_section">{data.status}</div>
            <div className="order_row_section small_order_row_section">{new Date((data.timestamp*1000)).toLocaleString('de-DE', { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}</div>
            <div className="order_row_section small_order_row_section">{data.package_type}</div>
            <div className="order_row_section">{data.name}</div>
            <div className="order_row_section">{data.address}</div>
            <div className="order_row_section small_order_row_section">{data.zip}</div>
            <div className="order_row_section small_order_row_section interact_order_section">
                {
                    !data.timePickedUp ? (
                        <img src={check} className="order_row_icon" onClick={pickedUp} />
                    ) : (
                        new Date((data.timePickedUp*1000)).toLocaleString('de-DE', { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })
                    )
                }
            </div>
        </div>
    );
};

export default StoreListItem;
