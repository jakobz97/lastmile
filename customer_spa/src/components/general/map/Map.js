import React, {useEffect} from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '85%',
    height: '50%',
    borderRadius: '6px',
    marginBottom: '2%'
};

function Map({center, markers, selectedShop, zoom}) {

    return (
        <LoadScript googleMapsApiKey="AIzaSyD4RJeYLCNhQe2LaqI9dCSIcdPjHI3Hfo0">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
            >
                {
                    markers.map(({ _id, name, lat, lng }) => (
                        <Marker position={{lat: lat, lng: lng}} onClick={() => selectedShop({selectedShop: _id, shopName: name})}></Marker>
                    ))
                }
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(Map)
