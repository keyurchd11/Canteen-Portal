import React, { Component } from 'react';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


export default class RegisterCustomers extends Component {
    constructor(props) {
        super(props);
        this.onChangeUserEmail = this.onChangeUserEmail.bind(this);
        this.onChangeUserPassword = this.onChangeUserPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            userPassword: '',
            userEmail: '',
            loggedIn: false,
        }
    }

    // for user
    onChangeUserEmail(e) {
        this.setState({
            userEmail: e.target.value
        })
    }

    onChangeUserPassword(e) {
        this.setState({
            userPassword: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            email: this.state.userEmail,
            password: this.state.userPassword,
        }
        console.log(user);
        localStorage.setItem('accessToken', '-1');
        axios.post('http://localhost:5000/customer/login', user)
            .then(res => {
                console.log(res.data.accessToken);
                console.log(res.data);
                localStorage.setItem('accessToken', res.data.accessToken);
                localStorage.setItem('userType', 0);
                console.log("NAv now");
                this.setState({ loggedIn: true });
            })
            .catch((err) => {
                if (err.response) {
                    alert(err.response.data);
                }
            });
        this.setState({
            userPassword: '',
            userEmail: '',
            loggedIn: false,
        })

    }

    render() {
        return (
            <div>
                <h3>Login Customer</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.userEmail}
                            onChange={this.onChangeUserEmail}
                        />
                        <label>Password: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.userPassword}
                            onChange={this.onChangeUserPassword}
                        />
                    </div>
                    <div className="form-group">
                        <br></br>
                        <input type="submit" value="Login" className="btn btn-primary" />
                    </div>
                </form>
                {
                    this.state.loggedIn? <Navigate to='/dashboard'/> : <span></span>
                }
            </div>
        )
    }
}