const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    tags: {
        type: [String],
        default: [],
        required: false,
    },
    addOns: {
        type: Map, of: Number,
        default: {},
    },
    price: {
        type: Number,
    },
    rating: {
        type: Number, default: 0,
        required: true
    },
    veg: {
        type: Boolean, default: true,
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    vendorID: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    },
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;



// {
//     "name":"Trial2",
//     "description":"Not kadamb food",
//     "tags":["tasty","hot"],
//     "addOns":{
//         "double":42,
//         "strawberry":40
// },
//     "price":32,
//     "veg":true,
//     "vendorName":"Dinesh Yadav"
// }