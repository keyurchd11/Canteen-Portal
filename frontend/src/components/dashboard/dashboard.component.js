import React, { useState, useEffect } from "react";
import axios from "axios";
import ErrorPage from "./errorPage"
import CustomerDashboard from "./customerDashboard"
import VendorDashboard from "./vendorDashboard"

const Dashboard = (props) => {
    const [auth, setAuth] = useState(-1)
    const [userType, setUserType] = useState(-1)
    const [userID, setUserID] = useState(-1)
    const [errorMessage, setErrMsg] = useState("Sorry! You do not have access to this page :(")
    useEffect(() => {
        const authToken = localStorage.getItem("accessToken");
        setAuth(authToken)
        let authBody = {
            authToken: authToken
        }
        axios.post('/api/api/verifyUser', authBody)
            .then(res => {
                // console.log(res);
                setUserID(res.data.id);
                setUserType(res.data.userType);
            });

    }, [])

    return (
        <div>
            <center>
                {console.log(userType)}
                {userType == -1 ? (<ErrorPage errorMsg={errorMessage} />) : (userType == 0 ? <CustomerDashboard customerId = {userID} /> : <VendorDashboard vendorID = {userID}/>)}
            </center>
        </div>
    )
};


export default Dashboard;