 const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },  
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: Number,
        required: false,
    },
    age: {
        type: Number,
        required: true,
    },
    batchName: {
        type: String,
        required: true
    },
    favoriteItems: {
        type: [String],
        default: [],
        required: true,
    },
    moneyLeft: {
        type: Number,
        default: 0,
        required: true
    },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;

// {
//     "name":"Trial2",
//     "description":"Not kadamb food",
//     "tags":["tasty","hot"],
//     "addOns":{
//         "double":42,
//         "strawberry":40
//     },
//     "price":32,
//     "veg":true,
//     "vendorName":"Dinesh Yadav"
// }
