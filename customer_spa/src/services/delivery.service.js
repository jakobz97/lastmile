import axios from "axios";
import auth_header from "./auth_header";

export const getDeliveries = async (index, type) => {
    let path = type !== 'shop' ? 'deliveries/' : 'deliveries/shop/';
    return axios
        .get(`https://gateway.last-mile-tum.de/${path}`,{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const createOutbounds = async (data) => {
    /*return [{
        ...data, ...{id: "12345", price: "4.99€", creation_time: Date.now(), status: "pending", accepted: "false"}
    }]*/
    return axios
        .post('https://gateway.last-mile-tum.de/outbound', data,{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const createStock = async (data) => {
    return axios
        .post('https://gateway.last-mile-tum.de/delivery/shop/', data,{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

export const updateStock = async (data) => {
    return axios
        .patch('https://gateway.last-mile-tum.de/delivery/', data,{ headers: await auth_header() })
        .then((response) => {
            return response.data;
        });
};

