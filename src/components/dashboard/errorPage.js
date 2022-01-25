import React, { useState, useEffect } from "react";
import axios from "axios";


const ErrorPage = (props) => {
    const [errorMsg, setErrorMsg] = useState("We ran into an error.")


    useEffect(() => {
        if (props.errorMsg != undefined)
            setErrorMsg(props.errorMsg);
    }, [props])


    return (
        <div>
            <img src="https://i.ibb.co/FJ1NPT0/Screenshot-from-2022-01-29-12-09-19.png">
            </img>
            <h1>{errorMsg}</h1>
        </div>
    )
};


export default ErrorPage;