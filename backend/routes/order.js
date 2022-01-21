const router = require('express').Router();
let Orders = require('../models/order.model');
let jwt = require('jsonwebtoken');

router.route('/').get((req, res) => {
    Orders.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    // console.log(req.body);
    const foodID = req.body.foodID;
    const customerID = req.body.customerID;
    const vendorID = req.body.vendorID;
    const quantity = req.body.quantity;
    const addOns = req.body.addOns;
    const status = 0
    const ratingGiven = 0;
    const customerBatch = req.body.customerBatch;
    const customerAge = req.body.customerAge;
    const cost = req.body.cost;
    // console.log(name, description, tags, addOns, price, veg, vendorName, rating);
    const newOrder = new Orders({
        foodID,
        customerID,
        vendorID,
        quantity,
        addOns,
        ratingGiven,
        status,
        customerBatch,
        customerAge,
        cost,
    });

    newOrder.save()
        .then(() => res.json('Order added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').post((req, res) => {
    Orders.findById(req.params.id)
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/changeState/:id').post(authenticateToken, (req, res) => {
    Orders.findById(String(req.params.id))
        .then(order => {
            console.log(order.vendorID, req.body.user_id);
            if (order.vendorID == req.body.user_id) {
                order.status = req.body.newState;
                order.save()
                    .then(() => res.json('Order Status updated!'))
                    .catch(err => res.status(400).json('Error: ' + err));
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/updateRating/:id').post((req, res) => {
    Orders.findById(String(req.params.id))
        .then(order => {
            order.ratingGiven = req.newRating;
            order.save()
                .then(resp => res.json(resp))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

function authenticateToken(req, res, next) {
    const token = req.body.authToken
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
        console.log("ORDER-auth")
        if (err) return res.sendStatus(403)
        req.body.user_id = user_id.userId
        req.body.userType = user_id.userType
        console.log(user_id);
        next()
    })
}


module.exports = router;