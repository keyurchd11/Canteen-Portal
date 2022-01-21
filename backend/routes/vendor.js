const router = require('express').Router();
let Vendor = require('../models/vendor.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: '..' });

router.route('/register').post((req, res) => {
    const email = req.body.email;
    Vendor.findOne({ email: email })
        .then((dupVendor) => {
            if (dupVendor) {
                return res.status(400).json("Vendor EXISTS");
            }
            const managerName = req.body.managerName;
            const password = bcrypt.hashSync(req.body.password, 10);
            const contactNumber = req.body.contactNumber;
            const shopName = req.body.shopName;
            const oh = req.body.oh;
            const om = req.body.om;
            const ch = req.body.ch;
            const cm = req.body.cm;
            const newVendor = new Vendor({
                managerName,
                password,
                shopName,
                email,
                contactNumber,
                oh,
                om,
                ch,
                cm,
            });

            newVendor.save()
                .then((savedVendor) => {
                    if (!savedVendor)
                        return res.status(401).json("Failed to add vendor.");
                    const vendor = { vendorId: savedVendor._id, userType: 1 };
                    const accessToken = jwt.sign(vendor, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
                    res.json({ accessToken: accessToken })
                })
                .catch((err) => { res.status(400).json(err) });
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
})

router.route('/').get((req, res) => {
    Vendor.find()
        .then(vendors => res.json(vendors))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/myDetails/').post(authenticateToken, (req, res) => {
    Vendor.findById(req.body.user_id).select('-password')
        .then(vendorDetails => res.json(vendorDetails))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const email = req.body.email
    const password = req.body.password
    Vendor.findOne({ email })
        .then((vendor) => {
            if (!vendor) {
                return res.status(400).json("Vendor doesn't exist.");
            }
            const checkPassword = bcrypt.compare(password, vendor.password);
            if (!checkPassword) {
                return res.status(401).json("Incorrect credentials. Access denied.");
            }
            const vendorID = { userId: vendor._id, userType: 1 };
            const accessToken = jwt.sign(vendorID, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' })
            return res.status(200).json({ accessToken: accessToken });
        })
        .catch((err) => res.status(400).json(err));
})


router.route('/update').post(authenticateToken, (req, res) => {
    const email = req.body.email;
    Vendor.findById(req.body.user_id)
        .then((vendor) => {
            // console.log(vendor,req.body);
            vendor.managerName = req.body.managerName;
            vendor.password = bcrypt.hashSync(req.body.password, 10);
            vendor.contactNumber = req.body.contactNumber;
            vendor.shopName = req.body.shopName;
            vendor.oh = req.body.oh;
            vendor.om = req.body.om;
            vendor.ch = req.body.ch;
            vendor.cm = req.body.cm;
            vendor.save()
                .then((savedVendor) => {
                    if (!savedVendor)
                        return res.status(401).json("Failed to add vendor.");
                    res.json("Updated succssfully");
                })
                .catch((err) => { res.status(400).json(err) });
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
})

// Utility Functions
function authenticateToken(req, res, next) {
    const token = req.body.authToken
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
        // console.log(user_id);
        // console.log(err);
        if (err) return res.sendStatus(403)
        req.body.user_id = user_id.userId
        req.body.userType = user_id.userType
        next()
    })

}

module.exports = router;


// {
//     "managerName":"TrialVendor",
//     "password":"vendor",
//     "email": "vendor1@err.com",
//     "contactNumber": 12345647,
//     "shopName":"JC",
//     "oh":8,
//     "om":3,
//     "ch":23,
//     "cm":40
// }