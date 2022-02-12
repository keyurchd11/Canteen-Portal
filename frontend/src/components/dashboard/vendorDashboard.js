import React, { useState, useEffect } from "react";
import DisplayCard from "./card.comp";
import axios from 'axios';


function VendorDashboard(props) {
    const [activeOrders, setActive] = useState(0);
    const [vendorID, setVendorID] = useState("");
    const [orders, setOrders] = useState([]);
    const [startDisplaying, setStartDisplay] = useState(false);
    useEffect(() => {
        ////////////////////////////////////////////////////////////////////////////////////
        if (props.vendorID != undefined) {
            console.log(props.vendorID);
            setVendorID(props.vendorID);
        }
        // setVendorID("61f574d2669074eef691c06c");
    }, [props]);

    useEffect(() => {
        if (vendorID != "") {
            axios.get("/api/order")
                .then(res => {
                    // console.log(res);
                    let tempOrders = res.data.filter(orders => orders.vendorID == vendorID);
                    setOrders(tempOrders);
                })
        }
    }, [vendorID]);

    useEffect(() => {
        console.log(orders);
        if (orders.length > 0)
            setStartDisplay(true);
    }, [orders]);

    

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
                {
                    orders.map((order, ind) => {
                        return <DisplayCard key={ind} orderDetails={order} />
                    })
                }
            </div>
        </div>

    )
}
export default VendorDashboard