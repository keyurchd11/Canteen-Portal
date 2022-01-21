import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Good Food Services</Link>

                <div className="collpase navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="navbar-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        {localStorage.getItem('userType') == 0 ? (
                            <li className="navbar-item">
                                <Link to="/editCustomerProfile" className="nav-link">Edit Profile</Link>
                            </li>) : (<span></span>)}
                        {localStorage.getItem('userType') == 0 ? (
                            <li className="navbar-item">
                                <Link to="/myOrders" className="nav-link">My Orders</Link>
                            </li>) : (<span></span>)
                        }
                        {localStorage.getItem('userType') == 1 ? (
                            <li className="navbar-item">
                                <Link to="/editVendorProfile" className="nav-link">Edit Profile</Link>
                            </li>) : (<span></span>)
                        }
                        {localStorage.getItem('userType') == 1 ? (
                            <li className="navbar-item">
                                <Link to="/addFood" className="nav-link">Add Food Items</Link>
                            </li>) : (<span></span>)
                        }
                        {localStorage.getItem('userType') == 1 ? (
                            <li className="navbar-item">
                                <Link to="/myFoodItems" className="nav-link">My Food Items</Link>
                            </li>) : (<span></span>)
                        }
                        {localStorage.getItem('userType') == 1 ? (
                            <li className="navbar-item">
                                <Link to="/vendorStats" className="nav-link">Stats</Link>
                            </li>) : (<span></span>)
                        }
                    </ul>
                </div>
            </nav>
        );
    }
}