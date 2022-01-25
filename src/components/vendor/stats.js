import React, { useState, useEffect } from "react";
import axios from 'axios';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';


function VendorStats(props) {
    const [vendorID, setVendorID] = useState("");
    const [orders, setOrders] = useState([]);
    const [ageX, setAgeX] = useState([]);
    const [ageY, setAgeY] = useState([]);
    const [batchX, setBatchX] = useState([]);
    const [batchY, setBatchY] = useState([]);
    const [labelBatch, setLabelBatch] = useState([]);
    const [batchDistrib, setBatchDistrib] = useState([]);
    const [ageDistrib, setAgeDistrib] = useState([]);
    const [ordersPlaced, setPlaced] = useState(0);
    const [ordersPending, setPending] = useState(0);
    const [ordersCompleted, setCompleted] = useState(0);

    useEffect(() => {
        const authToken = localStorage.getItem("accessToken");
        let authBody = {
            authToken: authToken
        }
        axios.post('http://localhost:5000/api/verifyUser', authBody)
            .then(res => {
                // console.log(res);
                setVendorID(res.data.id);
            });
    }, [])

    useEffect(() => {
        if (vendorID != "") {
            axios.get("http://localhost:5000/order")
                .then(res => {
                    let tempOrders = res.data.filter(orders => { return orders.vendorID == vendorID });
                    tempOrders = tempOrders.filter(ord => { return ord.status == 4 });
                    console.log(tempOrders);
                    setPending((res.data.filter(order => { return (order.status > 0 && order.status < 4) })).length);
                    setPlaced((res.data.filter(orders => { return orders.vendorID == vendorID })).length);
                    setCompleted((res.data.filter(order => { return (order.status == 4) })).length);

                    let tempAge = {};
                    let tempBatch = {};
                    tempBatch.UG1 = 0;
                    tempBatch.UG2 = 0;
                    tempBatch.UG3 = 0;
                    tempBatch.UG4 = 0;
                    tempBatch.UG5 = 0;
                    for (let i in tempOrders) {
                        if (tempAge[tempOrders[i].customerAge] == undefined)
                            tempAge[tempOrders[i].customerAge] = 0;
                        tempAge[tempOrders[i].customerAge] += 1;
                        if (tempBatch[tempOrders[i].customerBatch] == undefined) {
                            tempBatch[tempOrders[i].customerBatch] = 0;
                        }
                        tempBatch[tempOrders[i].customerBatch] += 1;
                    }
                    let tageX = [];
                    let tageY = [];
                    let ageDistrib1 = [];
                    let batchPlotData = [];
                    let tbatchX = [];
                    let tbatchY = [];
                    for (let x in tempAge) {
                        // console.log(x);
                        tageX.push(x.toString());
                        tageY.push(Number(tempAge[x]));
                        ageDistrib1.push({ age: x, val: tempAge[x] });
                    }
                    setAgeX(tageX);
                    setAgeY(tageY);
                    setAgeDistrib(ageDistrib1)
                    let count = 1
                    for (let x in tempBatch) {
                        batchPlotData.push({ batch: count, value: Number(tempBatch[x]) });
                        tbatchX.push(count)
                        labelBatch.push(x)
                        tbatchY.push(Number(tempBatch[x]));
                        count += 1
                    }
                    // setAgeDistrib(agePlotData);
                    setBatchDistrib(batchPlotData);
                    setBatchX(tbatchX);
                    setBatchY(tbatchY);
                    setLabelBatch(labelBatch);
                    // console.log(tageX, tageY, ageDistrib1);
                    console.log(tbatchY, tbatchX, batchPlotData);
                })
        }
    }, [vendorID]);

    return (
        <div>
            Orders Placed: {ordersPlaced}
            <br></br>
            Pending Orders: {ordersPending}
            <br></br>
            Completed Orders: {ordersCompleted}
            <br></br>
            <div>
                <VictoryChart
                    domainPadding={20}
                >
                    <VictoryAxis
                        tickValues={ageX}
                        tickFormat={ageX}
                    />
                    <VictoryAxis
                        dependentAxis={ageY}
                    // tickFormat={(x) => (`$${x / 1000}k`)}
                    />
                    <VictoryBar
                        data={ageDistrib}
                        x="age"
                        y="val"
                    />
                </VictoryChart>
            </div>
            <div>
                <VictoryChart
                    domainPadding={20}
                >
                    <VictoryAxis
                        tickValues={[1, 2, 3, 4, 5]}
                        tickFormat={["UG1", "UG2", "UG3", "UG4", "UG5"]}
                    />
                    <VictoryAxis
                        dependentAxis
                    />
                    <VictoryBar
                        data={batchDistrib}
                        x="batch"
                        y="value"
                    />
                </VictoryChart>
            </div>
        </div>

    )
}
export default VendorStats