import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'

const Food = () => {
    const [newFood, setNewFood] = useState(
        {
            name: '',
            description: '',
            tags: '',
            addOns: '',
            price: '',
            rating: '',
            veg: false,
            vendorName: '',
            vendorID: '',
            photo: ''
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const tags = [] = newFood.tags.split(',')
        const finalTags = [];
        for (let i in tags) {
            tags[i] = tags[i].replace(/ /g, '')
            if (tags[i] != "")
                finalTags.push(tags[i]);
        }
        console.log(finalTags);
        if (finalTags.length == 0) {
            alert("Kindly add tags for the food item.");
            return;
        }
        const finalAddOns = {}

        if (newFood.addOns != "") {
            let addOns = newFood.addOns.split(',')
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
        console.log(finalAddOns);

        formData.append('name', newFood.name);
        formData.append('photo', newFood.photo);
        formData.append('description', newFood.description);
        formData.append('price', newFood.price);
        formData.append('tags', newFood.tags);
        formData.append('addOns', newFood.addOns);
        formData.append('veg', newFood.veg);
        formData.append('vendorID', 'Trial');
        formData.append('vendorName', 'Trial');


        axios.post('/api/food/add/', formData)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const handleChange = (e) => {
        if (e.target.type != 'checkbox')
            setNewFood({ ...newFood, [e.target.name]: e.target.value });
        else
            setNewFood({ ...newFood, [e.target.name]: e.target.checked });


    }
    useEffect(() => {
        console.log(newFood);
    }, [newFood]);

    const handlePhoto = (e) => {
        setNewFood({ ...newFood, photo: e.target.files[0] });

    }

    return (
        <div>
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                <center>
                    Name: {" "}
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        value={newFood.name}
                        required={true}
                        onChange={handleChange}
                    />
                    <br></br><br></br>
            Description: {" "}
                    <input
                        type="text"
                        placeholder="description"
                        name="description"
                        value={newFood.description}
                        onChange={handleChange}
                    />
                    <br></br><br></br>

            Price: {" "}
                    <input
                        type="number"
                        placeholder="price"
                        name="price"
                        required={true}
                        value={newFood.price}
                        onChange={handleChange}
                    />
                    <br></br><br></br>

            Image: {" "}
                    <input
                        required={true}
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        name="photo"
                        onChange={handlePhoto}
                    />
                    <br></br><br></br>
            Veg: {" "}
                    <input
                        type="checkbox"
                        name="veg"
                        value={newFood.veg}
                        onChange={handleChange}
                    />
                    <br></br><br></br>
            Tags: (Enter comma separated list of tags. ex: sweet,cold,chocolate)
                <input
                        type="text"
                        placeholder="tags"
                        name="tags"
                        value={newFood.tags}
                        onChange={handleChange}
                    />
                    <br></br><br></br>

            AddOns: (Enter comma separated list of key-value pairs. ex: double:10,strawberry:15)
                <input
                        type="text"
                        placeholder="addOns"
                        name="addOns"
                        value={newFood.addOns}
                        onChange={handleChange}
                    />
                    <br></br><br></br>
                    <input
                        type="submit"
                        value="Add Food Item"
                    />

                </center>
            </form>
        </div>
    );
}

export default Food;
