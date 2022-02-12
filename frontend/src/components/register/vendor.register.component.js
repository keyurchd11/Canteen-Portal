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

        axios.post('/api/vendor/register', vendor)
            .then((res) => {
                console.log(res.data.accessToken);
                console.log(res.data);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('userType', 1);
                this.setState({ registered: true });
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data);
                }
            });

        this.setState({
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
            closingTime: '20:00',
            registered: false,
        })
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

                        <label>Email: </label>
                        <input type="text"
                            required
                            className="form-control"
                            type="email"
                            value={this.state.shopEmail}
                            onChange={this.onChangeShopEmail}
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
                {
                    this.state.registered ? <Navigate to='/temp' /> : <span></span>
                }
            </div>
        )
    }
}
