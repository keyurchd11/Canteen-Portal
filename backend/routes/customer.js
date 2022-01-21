const router = require('express').Router();
let Customer = require('../models/customer.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: '..' });

router.route('/register').post((req, res) => {
    const email = req.body.email;
    Customer.findOne({ email: email })
        .then((dupUser) => {
            if (dupUser) {
                return res.status(400).json("USER EXISTS");
            }
            console.log("REACHED");
            const name = req.body.name;
            const password = bcrypt.hashSync(req.body.password, 10);
            const contactNumber = req.contactNumber;
            const age = req.body.age;
            const batchName = req.body.batchName;
            const favoriteItems = [];
            const moneyLeft = 0;
            const newCustomer = new Customer({
                name,
                password,
                email,
                contactNumber,
                age,
                batchName,
                favoriteItems,
                moneyLeft,
            });

            newCustomer.save()
                .then((savedUser) => {
                    if (!savedUser)
                        return res.status(401).json("Failed to add user.");
                    const user = { userId: savedUser._id, userType: 0 };
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
                    res.json({ accessToken: accessToken })
                })
                .catch((err) => { res.status(400).json(err) });
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
})


router.route('/update').post((req, res) => {
    console.log("In update");
    const email = req.body.email;
    console.log(req.body);
    Customer.findOne({ 'email': email })
        .then((user) => {
            user.name = req.body.name;
            user.contactNumber = req.body.contactNumber;
            user.age = req.body.age;
            user.batchName = req.body.batchName;
            console.log(user);
            user.save()
                .then((savedUser) => {
                    if (!savedUser)
                        return res.status(401).json("Failed to add user.");
                })
                .catch((err) => { res.status(400).json(err) });
        })
        .catch((err) => {
            return res.json(err);
        });
})


// router.route('/').get((req, res) => {
//     Customer.find()
//         .then(users => res.json(users))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/myDetails/').post(authenticateToken, (req, res) => {
    Customer.findById(req.body.user_id).select('-password')
        .then(userDetails => res.json(userDetails))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/userInfo/').post((req, res) => {
    console.log(req.body);
    Customer.findById(req.body.user_id).select('-password')
        .then(userDetails => {
            console.log(userDetails)
            res.json(userDetails)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});



router.route('/updateFavs').post(authenticateToken, (req, res) => {
    Customer.findById(req.body.user_id)
        .then(userDetails => {
            console.log(req.body);
            userDetails.favoriteItems = req.body.newFavs;
            userDetails.save()
                .then(res => res.json("Favs updated"))
                .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json('Error' + err));
})

router.route('/login').post((req, res) => {
    const email = req.body.email
    const password = req.body.password
    // console.log(email, password);
    // console.log(req.body);
    Customer.findOne({ 'email': email })
        .then((user) => {
            if (!user) {
                return res.status(400).json("User doesn't exist.");
            }
            const checkPassword = bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(401).json("Incorrect credentials. Access denied.");
            }
            const userID = { userId: user._id, userType: 0 };
            const accessToken = jwt.sign(userID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
            return res.status(200).json({ accessToken: accessToken });
        })
        .catch((err) => res.status(400).json(err));
})

router.route('/addMoney').post((req, res) => {
    const userID = req.body.user_id;
    Customer.findById(userID)
        .then(user => {
            user.moneyLeft += Number(req.body.toAdd);
            user.save()
                .then(e => res.json(e))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
})

// Utility Functions
function authenticateToken(req, res, next) {
    const token = req.body.authToken
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
        if (err) return res.sendStatus(403)
        req.body.user_id = user_id.userId
        req.body.userType = user_id.userType
        next()
    })

}

module.exports = router;


// {
//     "name":"TrialUser",
//     "password":"password",
//     "email": "trial@err.com",
//     "contactNumber": 1234567,
//     "age":19,
//     "batchName":"UG2"
// }