import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const statesOfOrder = ["Placed", "Accepted", "Cooking", "Ready for Pickup", "Completed", "Rejected"];

function DisplayCard(props) {

    const [orderDetails, setOrder] = useState(undefined);
    const [customerDetails, setCustomer] = useState(undefined);
    const [foodDetails, setFood] = useState(undefined);
    useEffect(() => {
        console.log(props);
        if (props.orderDetails != undefined) {
            setOrder(props.orderDetails);
        }
    }, [props]);

    useEffect(() => {
        if (orderDetails != undefined) {
            console.log("HELLO");
            let foodID = orderDetails.foodID;
            let userID = orderDetails.customerID;
            const user = { user_id: userID };
            axios.post("http://localhost:5000/customer/userInfo", user)
                .then(res => {
                    console.log("HERE");
                    console.log(res);
                    setCustomer(res.data);
                })
                .catch(err => {
                    console.log(":(");
                    console.log(err);
                });
            axios.get("http://localhost:5000/food/" + foodID.toString())
                .then(res => {
                    console.log("HERE");
                    console.log(res);
                    setFood(res.data);
                })
                .catch(err => alert(err));
        }
    }, [orderDetails]);

    const moveToNextStage = (e) => {
        axios.get("http://localhost:5000/order")
            .then(res => {
                // console.log(res);
                let vendorID = orderDetails.vendorID;
                let tempOrders = res.data.filter(orders => orders.vendorID == vendorID);
                let inProgress = 0
                for (let i in tempOrders) {
                    if (tempOrders[i] > 0 && tempOrders[i] < 4) {
                        inProgress += 1
                    }
                }
                const currStage = orderDetails.status;
                if (inProgress >= 10 && currStage == 0) {
                    alert("You can't accept more than 10 orders at a time :(");
                    return
                }
                let orderInfo = {
                    orderID: orderDetails._id.toString(),
                    authToken: localStorage.getItem("accessToken"),
                    newState: currStage + 1
                }
                console.log(orderInfo);
                axios.post("http://localhost:5000/order/changeState/" + String(orderDetails._id), orderInfo)
                    .then(res => {
                        console.log(res);
                        setOrder({ ...orderDetails, status: currStage + 1 });
                    })
            })

    };
    const rejectThisOrder = (e) => {
        const currStage = orderDetails.status;
        let orderInfo = {
            orderID: orderDetails._id.toString(),
            authToken: localStorage.getItem("accessToken"),
            newState: 5
        }
        console.log(orderInfo);
        axios.post("http://localhost:5000/order/changeState/" + String(orderDetails._id), orderInfo)
            .then(res => {
                console.log(res);
                setOrder({ ...orderDetails, status: 5 });
            })
    };

    return (
        <div>

            {
                (foodDetails != undefined && customerDetails != undefined) ?
                    (
                        <div style={{ width: '18rem', margin: '2rem' }}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={"http://localhost:5000/images/" + foodDetails.photo} />
                                <Card.Body>
                                    <Card.Title>{foodDetails.name}</Card.Title>
                                    Placed at: {orderDetails.createdAt} <br></br>
                                    Customer: {customerDetails.name} <br></br>
                                    Age: {customerDetails.age} <br></br>
                                    Batch: {customerDetails.batchName} <br></br>
                                    AddOns: {orderDetails.addOns.map((add, it) => <span>{add},</span>)}
                                    <br></br>
                                    Status: {statesOfOrder[orderDetails.status]}
                                    <br></br>
                                    {orderDetails.status < 4 ? <Button variant="primary" onClick={moveToNextStage}>Move to next stage</Button> : <span>Order {statesOfOrder[orderDetails.status]}</span>}
                                    {" "}
                                    {orderDetails.status == 0 ? <Button variant="danger" onClick={rejectThisOrder}>Reject</Button> : <span></span>}
                                </Card.Body>
                            </Card>
                        </div>
                    ) :
                    (<span>ISSUE</span>)
            }
        </div>

    )
}
export default DisplayCard