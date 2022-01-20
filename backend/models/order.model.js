const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    foodID: {
        type: String,
        required: true,
    },
    customerID: {
        type: String,
        required: true,
    },
    vendorID: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    addOns: {
        type: [String],
        required: false
    },
    ratingGiven: {
        type: Number,
        default: -1,
        required: false,
    },
    status: {
        type: Number,
        required: true,
        default: 0
        // 0-> placed, 1-> accepted, 2-> cooking ,3->READY FOR PICKUP
        // 4-> completed, 5-> Rejected.
    },
    customerBatch: {
        type: String,
        required: true,
    },
    customerAge: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;

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
