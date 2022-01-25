import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Navigate } from "react-router-dom";

export default class RegisterCustomers extends Component {
    constructor(props) {
        super(props);
        // user is customer
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserContact = this.onChangeUserContact.bind(this);
        this.onChangeUserAge = this.onChangeUserAge.bind(this);
        this.onChangeUserBatch = this.onChangeUserBatch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            userName: '',
            userPassword: '',
            userEmail: '',
            userContact: '',
            userAge: '',
            userBatch: '',
            registered: false,
        }
    }

    // for user
    onChangeUserName(e) {
        this.setState({
            userName: e.target.value
        })
    }
    onChangeUserPassword(e) {
        this.setState({
            userPassword: e.target.value
        })
    }
    onChangeUserEmail(e) {
        this.setState({
            userEmail: e.target.value
        })
    }
    onChangeUserContact(e) {
        this.setState({
            userContact: e.target.value
        })
    }
    onChangeUserAge(e) {
        this.setState({
            userAge: e.target.value
        })
    }
    onChangeUserBatch(e) {
        this.setState({
            userBatch: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            name: this.state.userName,
            password: this.state.userPassword,
            email: this.state.userEmail,
            contactNumber: this.state.userContact,
            age: this.state.userAge,
            batchName: this.state.userBatch,
        }
        console.log(user);
        axios.post('http://localhost:5000/customer/register', user)
            .then(res => {
                console.log(res.data.accessToken);
                console.log(res.data);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('userType', 0);
                this.setState({ registered: true });
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data);
                }
            });
        this.setState({
            userName: '',
            userPassword: '',
            userEmail: '',
            userContact: '',
            userAge: '',
            userBatch: '',
            registered: false,
        })
    }

    render() {
        return (
            <div>

                <h3>Register New Customer</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.userName}
                            onChange={this.onChangeUserName}
                        />
                        <label>Password: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.userPassword}
                            onChange={this.onChangeUserPassword}
                        />
                        <label>Email: </label>
                        <input type="text"
                            required
                            className="form-control"
                            type="email"
                            value={this.state.userEmail}
                            onChange={this.onChangeUserEmail}
                        />
                        <label>Contact: </label>
                        <input type="text"
                            pattern="[0-9]*"
                            required
                            className="form-control"
                            value={this.state.userContact}
                            onChange={this.onChangeUserContact}
                        />
                        <label>Age: </label>
                        <input type="text"
                            required
                            pattern="[0-9]*"
                            className="form-control"
                            value={this.state.userAge}
                            onChange={this.onChangeUserAge}
                        />
                        <label>Batch:  </label>{"    "}
                        <select value={this.state.userBatch} onChange={(event) => { this.setState({ userBatch: event.target.value }) }}>
                            <option value="UG1">UG1</option>
                            <option value="UG2">UG2</option>
                            <option value="UG3">UG3</option>
                            <option value="UG4">UG4</option>
                            <option value="UG5">UG5</option>
                        </select>
                    </div>
                    <br></br>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>
                </form>
                {
                    this.state.registered ? <Navigate to='/dashboard' /> : <span></span>
                }
            </div>
        )
    }
}
