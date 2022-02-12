import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import LoginCustomers from "./user.login.component"
import LoginVendors from "./vendor.login.component"


const options2 = [
    { label: "Customer", value: 1 },
    { label: "Vendor", value: 2 }
];

function DropDown() {
    const [selectedValue, setSelectedValue] = useState(1);
    const handleChange = e => {
        setSelectedValue(e.value);
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4"></div>
                <div className="col-md-4">
                    <Select
                        options={options2}
                        value={options2.find(obj => obj.value === selectedValue)}
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-4"></div>
            </div>
            <div>
                {selectedValue == 1 ? <LoginCustomers /> : <LoginVendors />}
            </div>
        </div>
    )
}

export default DropDown;