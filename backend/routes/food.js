const router = require('express').Router();
let FoodItems = require('../models/food.model');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const { responsiveFontSizes } = require('@mui/material');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

router.route('/').get((req, res) => {
    // console.log("HUA");
    FoodItems.find()
        .then(foodItems => res.json(foodItems))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post(upload.single('photo'), (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const photo = req.file.filename;
    const description = req.body.description;
    const price = req.body.price;
    const vendorID = req.body.vendorID;
    const vendorName = req.body.vendorName;
    const rating = 0;

    const tags = [] = req.body.tags.split(',')
    const finalTags = [];
    for (let i in tags) {
        tags[i] = tags[i].replace(/ /g, '')
        if (tags[i] != "")
            finalTags.push(tags[i]);
    }
    console.log(finalTags);
    const finalAddOns = {}

    if (req.body.addOns != "") {
        let addOns = req.body.addOns.split(',')
        for (let i in addOns) {
            addOns[i] = addOns[i].replace(/ /g, '');
            if (addOns[i] != "") {
                const newAdd = addOns[i].split(':');
                if (newAdd.length != 2) {
                    alert("Pls enter add-ons correctly.");
                    return;
                }
                if (isNaN(newAdd[1])) {
                    alert("Pls enter add-ons correctly.");
                    return;
                }
                finalAddOns[newAdd[0].toString()] = Number(newAdd[1]);
            }
        }
    }

    // const tags = req.body.tags;
    // const addOns = req.body.addOns;
    const veg = req.body.veg;
    console.log(name, description, finalTags, finalAddOns, price, veg, vendorName, rating);
    const newFood = new FoodItems({
        name,
        description,
        finalTags,
        finalAddOns,
        price,
        rating,
        veg,
        vendorName,
        vendorID,
        photo
    });

    newFood.save()
        .then(() => res.json('Food item added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    FoodItems.findById(req.params.id)
        .then(foodItems => res.json(foodItems))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/updateRating').post((req, res) => {
    FoodItems.findById(req.body.foodID)
        .then(food => {
            food.ratingGiven = req.body.newRating;
            food.save()
                .then(resp => {
                    res.json(resp)
                })
        })
})

module.exports = router;
// router.route('/:id').delete((req, res) => {
//   Exercise.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Exercise deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });


// router.route('/update/:id').post((req, res) => {
//   Exercise.findById(req.params.id)
//     .then(exercise => {
//       exercise.username = req.body.username;
//       exercise.description = req.body.description;
//       exercise.duration = Number(req.body.duration);
//       exercise.date = Date.parse(req.body.date);

//       exercise.save()
//         .then(() => res.json('Exercise updated!'))
//         .catch(err => res.status(400).json('Error: ' + err));
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// });
