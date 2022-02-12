import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


function MyFood(props) {

    const [vendor, setUserID] = useState(0);
    const [foods, setFood] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem("accessToken");
        // setAuth(authToken)
        let authBody = {
            authToken: authToken
        }
        axios.post('/api/api/verifyUser', authBody)
            .then(res => {
                // console.log(res);
                setUserID(res.data.id);
                // setUserType(res.data.userType);
            });

    }, [])

    useEffect(() => {
        axios
            .get("/api/food")
            .then((response) => {
                const allItems = response.data.filter(food => { return food.vendorID == vendor });
                setFood(allItems);
            });
    }, [vendor]);
    return (
        <div>
            {foods.map((food, ind) =>
                <div key={ind}>
                    {food.id}
                    <br>
                    </br>
                    {food.name}
                    <br></br>
                    {food.price}
                </div>
            )}
        </div>
    );

}

export default MyFood;