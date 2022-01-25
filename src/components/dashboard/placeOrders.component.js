import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from "react";
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
// import { cleanCommonProps } from 'react-select/dist/declarations/src/utils';

export default function ResponsiveDialog(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [quantity, setQuantity] = useState(1);
    const [addOnsSelected, setAddOns] = useState([]);
    const [addOnsAvailable, setAddOnsAvailable] = useState([]);
    const [foodItem, setFoodItem] = useState();
    const [fullWidth, setFullWidth] = React.useState(true);
    const [userID, setUserID] = useState("-1");
    const [basePrice, setBasePrice] = useState(0);
    const [addOnsPrice, setAddOnsPrice] = useState(0);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const temp = [];
        setFoodItem(props.foodDetails)
        const availableAdds = props.foodDetails.addOns;
        let count = 1;
        let selectedAdds = [];
        for (let i in availableAdds) {
            let currAddOnName = i.toString();
            currAddOnName += (" (" + String(availableAdds[i]) + ")");
            // console.log(currAddOnName);
            selectedAdds.push(i.toString());
            temp.push({ name: currAddOnName, id: count, isChecked: true, addOnName: i.toString() });
            count += 1;
        }
        setAddOns(selectedAdds);
        // console.log(temp);
        if (props.customerId != undefined)
            setUserID(props.customerId);
        setAddOnsAvailable(temp);
        // console.log(addOnsAvailable);
    }, [props]);


    useEffect(() => {
        // console.log(addOnsAvailable);
    }, [addOnsAvailable]);
    useEffect(() => {
        // console.log(foodItem);
        if (foodItem != undefined) {
            setBasePrice(foodItem.price);
            let aCost = 0;
            for (let x in foodItem.addOns) {
                aCost += foodItem.addOns[x];
            }
            setAddOnsPrice(aCost);
        }
    }, [foodItem]);

    const placeOrder = () => {
        const totalCost = (basePrice + addOnsPrice) * quantity;
        const user = { authToken: localStorage.getItem("accessToken") };
        axios.post('http://localhost:5000/customer/myDetails', user)
            .then(res => {
                console.log(res);
                if (res.data.moneyLeft < totalCost) {
                    alert("Kindly add money to wallet. Balance not sufficient!");
                    return;
                }
                const newOrder = {
                    foodID: foodItem._id,
                    customerID: userID,
                    vendorID: foodItem.vendorID,
                    quantity: quantity,
                    addOns: addOnsSelected,
                    customerBatch: res.data.batchName,
                    customerAge: res.data.age,
                    cost: totalCost,
                }
                console.log(newOrder);
                axios.post('http://localhost:5000/order/add', newOrder)
                    .then(res => {

                        let toAdd = Number(totalCost) * (-1);

                        let bdy = {
                            toAdd: Number(toAdd),
                            user_id: userID,
                        }
                        axios.post('http://localhost:5000/customer/addMoney', bdy)
                            .then(res => {
                                alert("Order Placed!");
                            })
                            .catch(err => alert(err));

                    })
                    .catch(err => {
                        if (err.response) {
                            alert(err.response.data);
                        }
                    })

            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data);
                }
            });


    };
    const updateAddOnsSelected = (selectedList, selectedItem) => {

        let cost = 0;
        let final = [];
        for (let x in selectedList) {
            if (foodItem != undefined) {
                cost += foodItem.addOns[(selectedList[x].addOnName)];
                final.push((selectedList[x].addOnName));
            }
        }
        setAddOnsPrice(cost);
        setAddOns(final);
    };

    return (

        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                <img src="https://cdn-icons-png.flaticon.com/512/34/34627.png" height="50" width="70" />
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Place Order"}
                </DialogTitle>
                <DialogContent>

                    {foodItem != undefined ? <img src={"http://localhost:5000/images/" + foodItem.photo}></img> : <span></span>}
                    <DialogContentText>
                        Select Addons:

                        <Multiselect
                            options={addOnsAvailable} // Options to display in the dropdown
                            selectedValues={addOnsAvailable} // Preselected value to persist in dropdown
                            onSelect={updateAddOnsSelected} // Function will trigger on select event
                            onRemove={updateAddOnsSelected} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                        <br></br>
                        <br></br>
                        <TextField id="outlined-basic" label="Quantity" variant="outlined" default="1"
                            onChange={(e) => {
                                setQuantity(e.target.value)
                            }
                            }
                        />
                        <br></br>
                        <br></br>
                        Base Price    : {basePrice}
                        <br></br>
                        Add-Ons Price : {addOnsPrice}
                        <br></br>
                        Total         : {(basePrice + addOnsPrice) * quantity}
                        <br></br>

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button autoFocus onClick={placeOrder}>
                        Place Order
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
