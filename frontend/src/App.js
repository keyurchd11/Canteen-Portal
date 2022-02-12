import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Navbar from "./components/navbar.component";
import Home from "./components/home.component";
import Dashboard from "./components/dashboard/dashboard.component";
import Register from "./components/register/register.component";
import Login from "./components/login/login.component";
import Temp from "./components/discarded/temp"
import Vendor from "./components/dashboard/vendorDashboard"
import AddFood from "./components/dashboard/addItem.component"
import EditCustomerProfile from "./components/customer/editCustomerProfile"
import EditVendorProfile from "./components/vendor/vendorEditProfile"
import StatsPage from "./components/vendor/stats"
import MyOrders from "./components/customer/myOrders"
import MyItems from "./components/vendor/myfood"


function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/addFood" element={<AddFood />} />
          <Route path="/editCustomerProfile" element={<EditCustomerProfile />} />
          <Route path="/editVendorProfile" element={<EditVendorProfile />} />
          <Route path="/vendorStats" element={<StatsPage />} />
          <Route path="/myOrders" element={<MyOrders />} />
          <Route path="/myFoodItems" element={<MyItems />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
