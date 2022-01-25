import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

const statesOfOrder = ["Placed", "Accepted", "Cooking", "Ready for Pickup", "Completed", "Rejected"];

function MyOrders(props) {

    const [userID, setUserID] = useState(-1);
    const [myOrders, setMyOrders] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [ratingEntered,setRatingEntered] = useState({});
    useEffect(() => {
        const authToken = localStorage.getItem("accessToken");
        let authBody = {
            authToken: authToken
        }

        axios.post('http://localhost:5000/api/verifyUser', authBody)
            .then(res => {
                setUserID(res.data.id);
            });
    }, [])

    useEffect(() => {
        if (userID != -1) {
            axios.get("http://localhost:5000/order")
                .then(res => {
                    // console.log(res);
                    let tempOrders = res.data.filter(orders => orders.customerID == userID);
                    console.log(tempOrders);
                    setMyOrders(tempOrders);
                })
        }
        if (allFoods.length == 0) {
            axios.get("http://localhost:5000/food")
                .then(res => {
                    let allTemp = res.data;
                    setAllFoods(allTemp);
                })
        }
    }, [userID])
    
    const updateRating = (ord,ind)=> (e) => {
        e.preventDefault();
        console.log(e.target);
        console.log(ord);
        if (ratingEntered[ind]!=undefined) {
            const newRate = ratingEntered[ind];
            console.log(newRate);
            const pars = {
                newRating: newRate
            }
            axios.post("http://localhost:5000/order/" + String(ord._id), pars)
                .then(res => {
                    const item = ord.foodID;
                    axios.get("http://localhost:5000/order")
                        .then(res => {
                            // console.log(res);
                            let tempOrders = res.data.filter(orders => orders.customerID == userID);
                            console.log(tempOrders);
                            setMyOrders(tempOrders);
                            let totRate = 0
                            let totNum = 0
                            for (let i in tempOrders) {
                                if (tempOrders[i].foodID == item) {
                                    totRate += tempOrders[i].ratingGiven;
                                    totNum++;
                                }
                            }

                        })

                })
        }
    };

    return (
        <div>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Placed Time</TableCell>
                        <TableCell>Vendor Name</TableCell>
                        <TableCell>Food Item</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Rating</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {myOrders.map((order, ind) => (
                        <TableRow key={ind}>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>
                                {(allFoods.filter(food => { return food._id == order.foodID }))[0].vendorName}
                            </TableCell>
                            <TableCell>{(allFoods.filter(food => { return food._id == order.foodID }))[0].name}</TableCell>
                            <TableCell>
                                {order.quantity}
                            </TableCell>
                            <TableCell>
                                {
                                    statesOfOrder[order.status]
                                }
                            </TableCell>
                            <TableCell>
                                {
                                    order.cost || Math.floor(100 * (Math.random()))
                                }
                            </TableCell>
                            <TableCell>
                                <form
                                    onSubmit={updateRating(order,ind)}
                                >
                                    Rating: {" "}
                                    <input
                                        type="number"
                                        disabled={order.status != 4}
                                        placeholder="price"
                                        name="price"
                                        value={ratingEntered[ind]}
                                        onChange={e=>setRatingEntered({...ratingEntered,[ind]:e.target.value})}
                                        required={true}
                                    />
                                    <input
                                        type="submit"
                                        value="Add Rating"
                                    />
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default MyOrders