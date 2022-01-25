import React, { Component } from 'react';
import axios from 'axios';
import TimePicker from 'react-time-picker';
import Select from 'react-select';
import { Navigate } from "react-router-dom";

export default class RegisterVendors extends Component {
    constructor(props) {
        super(props);

        // user in vendor
        this.onChangeShopManager = this.onChangeShopManager.bind(this);
        this.onChangeShopPassword = this.onChangeShopPassword.bind(this);
        this.onChangeShopName = this.onChangeShopName.bind(this);
        this.onChangeShopEmail = this.onChangeShopEmail.bind(this);
        this.onChangeShopContact = this.onChangeShopContact.bind(this);
        this.onChangeShopOpenTime = this.onChangeShopOpenTime.bind(this);
        this.onChangeShopClosingTime = this.onChangeShopClosingTime.bind(this);

        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            shopManager: '',
            shopPassword: '',
            shopName: '',
            shopEmail: '',
            shopContact: 0,
            shopOH: 0,
            shopOM: 0,
            shopCH: 23,
            shopCM: 59,
            openTime: '10:00',
            closingTime: '20:00'
        }
        const vendorDetails = { authToken: localStorage.getItem("accessToken")};
        axios.post("http://localhost:5000/vendor/myDetails", vendorDetails)
            .then(res => {
                console.log(res);
                this.setState({
                    shopManager: res.data.managerName,
                    shopPassword: '',
                    shopName: res.data.shopName,
                    shopEmail: res.data.email,
                    shopContact: res.data.contactNumber,
                    shopOH: res.data.oh,
                    shopOM: res.data.om,
                    shopCH: res.data.ch,
                    shopCM: res.data.cm,
                    openTime: String(res.data.oh)+":"+String(res.data.om),
                    closingTime: String(res.data.ch)+":"+String(res.data.cm)
                })
            })
            .catch((err) => alert(err));
    }
    onChangeShopOpenTime(e) {
        this.setState({
            openTime: e,
        })
    }
    onChangeShopClosingTime(e) {
        this.setState({
            closingTime: e,
        })
    }
    onChangeShopManager(e) {
        this.setState({
            shopManager: e.target.value
        })
    }
    onChangeShopContact(e) {
        this.setState({
            shopContact: e.target.value
        })
    }
    onChangeShopEmail(e) {
        this.setState({
            shopEmail: e.target.value
        })
    }
    onChangeShopPassword(e) {
        this.setState({
            shopPassword: e.target.value
        })
    }
    onChangeShopName(e) {
        this.setState({
            shopName: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();
        const hr = Number(this.state.closingTime.split(':')[0]);
        const min = Number(this.state.closingTime.split(':')[1]);
        const vendor = {
            authToken:localStorage.getItem("accessToken"),
            managerName: this.state.shopManager,
            email: this.state.shopEmail,
            password: this.state.shopPassword,
            contactNumber: this.state.shopContact,
            shopName: this.state.shopName,
            oh: Number(this.state.openTime.split(':')[0]),
            om: Number(this.state.openTime.split(':')[1]),
            ch: hr,
            cm: min,
            registered: false,
        }

        console.log(vendor);

        axios.post('http://localhost:5000/vendor/update', vendor)
            .then((res) => {
                alert("Updated successfully!");
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data);
                }
            });
    }

    render() {
        return (
            <div>
                <h3>Register new shop</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Manager's Name: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.shopManager}
                            onChange={this.onChangeShopManager}
                        />

                        <label>Password: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.shopPassword}
                            onChange={this.onChangeShopPassword}
                        />

                        <label>Shop's Name: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.shopName}
                            onChange={this.onChangeShopName}
                        />

                        <label>Contact: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.shopContact}
                            onChange={this.onChangeShopContact}
                        />

                        <p><br></br>
                            Opening Time:
                        </p>
                        <TimePicker
                            onChange={this.onChangeShopOpenTime}
                            selected={this.state.openTime}
                            value={this.state.openTime}
                        />

                        <p><br></br>
                            Closing Time:
                        </p>
                        <TimePicker
                            onChange={this.onChangeShopClosingTime}
                            selected={this.state.closingTime}
                            value={this.state.closingTime}
                        />
                    </div>
                    <br></br>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
