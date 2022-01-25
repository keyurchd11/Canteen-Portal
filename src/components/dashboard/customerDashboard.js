import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Multiselect from 'multiselect-react-dropdown';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ResponsiveDialog from "./placeOrders.component"
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';



const FoodItemsList = (props) => {
    const [foodItems, setfoodItems] = useState([]);
    const [sortedfoodItems, setSortedfoodItems] = useState([]);
    const [sortPrice, setSortPrice] = useState(true);
    const [sortRating, setSortRating] = useState(true);
    const [sortName, setSortName] = useState(true);
    const [searchTexts, setSearchText] = useState([]);
    const [displayTags, changeDisplayTags] = useState([]);
    const [currentTags, changeCurrentTags] = useState([]);
    const [vendorsAvailable, changeVendorsAvailable] = useState();
    const [vendorsSelected, changeVendorsSelected] = useState([]);
    const [foodListLoaded, changeLoadStatus] = useState(false);
    const [favoriteItem, updateFavItems] = useState([]);
    const [searchUsed, updateSearchUsed] = useState(false);
    const [priceRange, setPriceRange] = React.useState([0, 100]);
    const [searchWords, setSearchWords] = useState([])
    const [vegFood, setVegFood] = useState(true);
    const [nonVegFood, setNonVegFood] = useState(true);
    const [userID, setUserID] = useState("-1");
    const [userDetails, setUserDetails] = useState(undefined);
    const [currBalance, setCurrBalance] = useState(0);
    const [fillWallet, changeFillWallet] = useState(0);


    // getting data and processing it
    useEffect(() => {
        axios
            .get("http://localhost:5000/food")
            .then((response) => {
                const allItems = response.data;
                const tempSearchWords = [];
                for (let it in allItems) {
                    allItems[it].displayNow = true;
                    if (!tempSearchWords.some(word => word.name == allItems[it].name))
                        tempSearchWords.push({ name: allItems[it].name });
                }
                setfoodItems(allItems);
                setSearchWords(tempSearchWords);
                // console.log(allItems);
                setSortedfoodItems(response.data);
                setSearchText([]);
                let countOfTags = 0;
                let foodItemsList = response.data;
                const tempDisplay = [];
                const tempVendors = [];
                let countOfVendors = 0;
                for (let i = 0; i < foodItemsList.length; i++) {
                    const tagsOfFood = foodItemsList[i].tags;
                    if (!tempVendors.some(vendor => vendor.name == foodItemsList[i].vendorName)) {
                        let vendorShopName = foodItemsList[i].vendorName;
                        tempVendors.push({ id: countOfVendors, name: vendorShopName, isChecked: true });
                        countOfVendors += 1;
                    }
                    // console.log(tagsOfFood);
                    for (let currTag in tagsOfFood) {
                        // console.log(currTag);
                        let check = false;
                        let currTagName = tagsOfFood[currTag];
                        for (let k = 0; k < countOfTags; k++) {
                            if (tempDisplay[k].name == currTagName)
                                check = true;
                        }
                        if (!check) {
                            tempDisplay.push({ id: countOfTags, name: currTagName, isChecked: true });
                            countOfTags += 1;
                        }
                    }
                }
                changeVendorsAvailable(tempVendors);
                changeDisplayTags(tempDisplay);
                changeCurrentTags(Array.from(tempDisplay, val => val.name));
                // console.log(tempVendors);
                changeVendorsSelected(Array.from(tempVendors, val => val.name));
                // console.log(displayTags);
                // setTimeout(2000);

            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (props.customerId != undefined) {
            setUserID(props.customerId);
            const user = { authToken: localStorage.getItem("accessToken") };
            axios.post('http://localhost:5000/customer/myDetails', user)
                .then(res => {
                    updateFavItems(res.data.favoriteItems);
                    setCurrBalance(res.data.moneyLeft);
                })
                .catch((err) => {
                    if (err.response) {
                        alert(err.response.data);
                    }
                });
        }
    }, [props]);

    const AddMoney = (e) => {
        e.preventDefault();
        let toAdd = Number(fillWallet);

        let bdy = {
            toAdd: Number(toAdd),
            user_id: userID,
        }
        axios.post('http://localhost:5000/customer/addMoney', bdy)
            .then(res => {
                // alert(res.data);
                console.log(res);
                let tot = Number(currBalance) + Number(toAdd);
                setCurrBalance(tot);
            })
            .catch(err => alert(err));
    };


    const updateTag = (selectedList, selectedItem) => {
        const temp = [];
        for (let x in selectedList)
            temp.push(selectedList[x].name);
        changeCurrentTags(temp);
    };

    const updateVendorsSelected = (selectedList, selectedItem) => {
        const temp = [];
        for (let x in selectedList)
            temp.push(selectedList[x].name);
        changeVendorsSelected(temp);
        // console.log(temp);
    };


    const sortChange = () => {
        let foodItemsTemp = foodItems;
        foodItemsTemp.sort((a, b) => {
            if (a.price != undefined && b.price != undefined) {
                // console.log(foodItemsTemp, sortPrice);
                if (sortPrice)
                    return (a.price - b.price);
                else
                    return (b.price - a.price);

            } else {
                return 1;
            }
        });
        setfoodItems(foodItemsTemp);
        setSortPrice(!sortPrice);
    };

    const sortAccordingToRating = () => {
        let foodItemsTemp = foodItems;
        foodItemsTemp.sort((a, b) => {
            if (a.rating != undefined && b.rating != undefined) {
                if (sortRating)
                    return (a.rating - b.rating);
                else
                    return (b.rating - a.rating);

            } else {
                return 1;
            }
        });
        setfoodItems(foodItemsTemp);
        setSortRating(!sortRating);
    };

    const sortAccordingToName = () => {
        let foodItemsTemp = foodItems;
        foodItemsTemp.sort((a, b) => {
            if (a.name != undefined && b.name != undefined) {
                if (sortName)
                    return (a.name < b.name);
                else
                    return (b.name < a.name);

            } else {
                return 1;
            }
        });
        setfoodItems(foodItemsTemp);
        setSortName(!sortName);
    };


    const changePriceRange = (event, newValue) => {
        setPriceRange(newValue);
    };

    useEffect(() => {
        console.log(foodItems);
    }, [foodItems])

    // for filtering the list of food items displayed
    useEffect(() => {
        console.log(priceRange, currentTags, vendorsSelected, searchTexts, vegFood, nonVegFood);

        const tempDisplay = foodItems;
        const newVals = [];
        for (let i in tempDisplay) {
            let valid = true;
            // price
            if (tempDisplay[i].price < priceRange[0] || tempDisplay[i].price > priceRange[1])
                valid = false;

            // veg non-veg
            if (tempDisplay[i].veg && !vegFood)
                valid = false;
            if (!tempDisplay[i].veg && !nonVegFood)
                valid = false;

            // checking tags now
            let checkTags = false
            for (let x in tempDisplay[i].tags) {
                if (currentTags.some(tag => tag == tempDisplay[i].tags[x])) {
                    checkTags = true;
                    break;
                }
            }
            if (checkTags == false)
                valid = checkTags;
            console.log(vendorsSelected);
            if (!vendorsSelected.some(vendor => vendor == tempDisplay[i].vendorName))
                valid = false;

            if (searchUsed) {
                if (!searchTexts.some(text => text == tempDisplay[i].name))
                    valid = false;
            }

            newVals.push({ ...tempDisplay[i], displayNow: valid });
        }
        setfoodItems(newVals);
    }, [priceRange, currentTags, vendorsSelected, searchTexts, vegFood, nonVegFood, searchUsed]);


    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h1>Food Items</h1>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={9} lg={9}>
                    <List component="nav" aria-label="mailbox folders">
                        <Autocomplete
                            multiple
                            id="combo-box-demo"
                            options={searchWords}
                            sx={{ width: 300 }}
                            fullWidth={true}
                            getOptionLabel={(option) => option.name.toString()}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    label="Search Food Items"
                                    fullWidth={true}
                                // onChange={searchedFoods}
                                />}

                            onChange={((event, value) => {
                                console.log(value);
                                if (value.length == 0)
                                    updateSearchUsed(false);
                                else {
                                    updateSearchUsed(true);
                                    const temp = []
                                    for (let text in value) {
                                        temp.push(value[text].name)
                                    }
                                    setSearchText(temp);
                                }
                            })}
                        />
                        {/* <TextField
                            id="standard-basic"
                            label="Search"
                            fullWidth={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            onChange={customFunction}
                        /> */}
                    </List>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <Divider />
                        <br></br>
                        <Grid item xs={12}>
                            Price Range(0-100) :
                        </Grid>
                        <ListItem>
                            <Box sx={{ width: 300 }}>
                                <Slider
                                    getAriaLabel={() => 'Price range'}
                                    value={priceRange}
                                    onChange={changePriceRange}
                                    valueLabelDisplay="auto"
                                // getAriaValueText={valuetext}
                                />
                            </Box>
                        </ListItem>
                        <Grid item xs={12}>
                            Min: {priceRange[0]}
                            <br></br>
                            Max: {priceRange[1]}
                        </Grid>
                        <Divider />
                        <br>
                        </br>
                        Select Tags:
                        <br>
                        </br>
                        <ListItem>
                            <Multiselect
                                options={displayTags} // Options to display in the dropdown
                                selectedValues={displayTags} // Preselected value to persist in dropdown
                                onSelect={updateTag} // Function will trigger on select event
                                onRemove={updateTag} // Function will trigger on remove event
                                displayValue="name" // Property name to display in the dropdown options
                            />
                        </ListItem>
                        <br>
                        </br>
                        <Divider />
                        <br>
                        </br>
                        Select Vendors:
                        <br>
                        </br>
                        <ListItem>

                            <Multiselect
                                options={vendorsAvailable} // Options to display in the dropdown
                                selectedValues={vendorsAvailable} // Preselected value to persist in dropdown
                                onSelect={updateVendorsSelected} // Function will trigger on select event
                                onRemove={updateVendorsSelected} // Function will trigger on remove event
                                displayValue="name" // Property name to display in the dropdown options
                            />

                        </ListItem>
                        <ListItem>
                            <Multiselect
                                options={[{ id: 1, name: "veg" }, { id: 2, name: "non-veg" }]} // Options to display in the dropdown
                                selectedValues={[{ id: 1, name: "veg" }, { id: 2, name: "non-veg" }]} // Preselected value to persist in dropdown
                                onSelect={(selected, selectedItem) => {
                                    for (let x in selected) {
                                        if (selected[x].name == "veg")
                                            setVegFood(true);
                                        if (selected[x].name == "non-veg")
                                            setNonVegFood(true);
                                    }
                                }} // Function will trigger on select event
                                onRemove={(selected, selectedItem) => {
                                    console.log(selected);
                                    setVegFood(false);
                                    setNonVegFood(false);
                                    for (let x in selected) {
                                        if (selected[x].name == "veg")
                                            setVegFood(true);
                                        if (selected[x].name == "non-veg")
                                            setNonVegFood(true);
                                    }
                                }} // Function will trigger on remove event
                                displayValue="name" // Property name to display in the dropdown options
                            />
                        </ListItem>
                        <ListItem>
                            <form onSubmit={AddMoney}>
                                Wallet: {" "}
                                <input
                                    type="number"
                                    placeholder="add money"
                                    name="addWallet"
                                    value={fillWallet}
                                    required={true}
                                    onChange={e => { changeFillWallet(e.target.value) }}
                                />
                                <br></br><br></br>
                                <input
                                    type="submit"
                                    value="Add Money"
                                />
                            </form>
                        </ListItem>
                        <ListItem>
                            Current Balance: {currBalance}
                        </ListItem>
                        {/* <ListItem>
                            <ResponsiveDialog />
                        </ListItem> */}

                        {/* <ListItem divider>
                            <Autocomplete
                                id="combo-box-demo"
                                options={foodItems}
                                getOptionLabel={(option) => option.name}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Names"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </ListItem> */}
                    </List>
                </Grid>
                <Grid item xs={12} md={9} lg={9}>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Price
                                        {" "}
                                        <Button onClick={sortChange}>
                                            {sortPrice ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        Item Name
                                        {" "}
                                        <Button onClick={sortAccordingToName}>
                                            {sortName ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Vendor Name</TableCell>
                                    <TableCell>Tags</TableCell>
                                    <TableCell>AddOns</TableCell>
                                    <TableCell>Favorites</TableCell>
                                    <TableCell>
                                        Rating
                                        {" "}
                                        <Button onClick={sortAccordingToRating}>
                                            {sortRating ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                        </Button>
                                    </TableCell>
                                    <TableCell>Place Order</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {foodItems.filter(food => food.displayNow == true).map((foodItem, ind) => (
                                    <TableRow key={ind}>
                                        <TableCell>{foodItem.price}</TableCell>
                                        <TableCell>{foodItem.name}</TableCell>
                                        <TableCell>
                                            <img height="50" width="70" src={"http://localhost:5000/images/" + String(foodItem.photo)}></img>
                                        </TableCell>
                                        <TableCell>{foodItem.vendorName}</TableCell>
                                        <TableCell>
                                            {
                                                foodItem.tags.map((tag, ind) => (
                                                    <span>
                                                        {tag}, {" "}
                                                    </span>
                                                ))
                                            }

                                        </TableCell>
                                        <TableCell>
                                            {
                                                Object.entries(foodItem.addOns).map(([key, value]) => {
                                                    // console.log(key, value);
                                                    return (<p>{key}:{value}</p>);
                                                })
                                            }

                                        </TableCell>
                                        <TableCell>
                                            <FormGroup>
                                                <Checkbox
                                                    label="1"
                                                    icon={<FavoriteBorder />}
                                                    checkedIcon={<Favorite />}
                                                    sx={{
                                                        color: "red",
                                                        '&.Mui-checked': {
                                                            color: "red",
                                                        },
                                                    }}
                                                    onChange={e => {
                                                        let newFav = [];
                                                        let check = false;
                                                        for (let i = 0; i < favoriteItem.length; i++) {
                                                            if (favoriteItem[i] == foodItem._id)
                                                                check = true;
                                                            else
                                                                newFav.push(favoriteItem[i])
                                                        }
                                                        if (!check)
                                                            newFav.push(foodItem._id);
                                                        // console.log(newFav);
                                                        updateFavItems(newFav);
                                                        const userDetail = {
                                                            authToken: localStorage.getItem("accessToken"),
                                                            newFavs: newFav
                                                        }
                                                        axios.post("http://localhost:5000/customer/updateFavs", userDetail)
                                                            .then(res => console.log(res))
                                                            .catch(err => alert(err))
                                                    }}
                                                    checked={favoriteItem.some(item => item == foodItem._id)}
                                                />
                                            </FormGroup>
                                        </TableCell>
                                        <TableCell>
                                            {foodItem.rating}
                                        </TableCell>
                                        <TableCell>
                                            <ResponsiveDialog foodDetails={foodItem} customerId={userID} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap" }}>
                {foodItems.map((item, ind) => {
                    return favoriteItem.some(item => item == item._id) ? <span>{item.name}</span> : <span></span>
                })}
            </div>
        </div >
    );
};

export default FoodItemsList;
