const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

// defining routes

const foodItemsRouter = require('./routes/food');
app.use('/food', foodItemsRouter);

const customerRouter = require('./routes/customer');
app.use('/customer', customerRouter);

const  vendorRouter = require('./routes/vendor');
app.use('/vendor', vendorRouter);

const  orderRouter = require('./routes/order');
app.use('/order', orderRouter);

const  apiRouter = require('./routes/api');
app.use('/api', apiRouter);


app.use(express.static("./images")); 
app.use('/images', express.static('images'));


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});