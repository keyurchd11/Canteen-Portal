const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    managerName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    shopName: {
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
        required: false
    },
    oh: {
        type: Number,
        required: true,
        default: 0
    },
    om: {
        type: Number,
        required: true,
        default: 0
    },
    ch: {
        type: Number,
        required: true,
        default: 23
    },
    cm: {
        type: Number,
        required: true,
        default: 59
    },
});

const Vendor = mongoose.model("Vendors", vendorSchema);

module.exports = Vendor;

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
