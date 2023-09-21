var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/STAR-APP').then(() => {
    console.log("Connected to database through mongoose.")
});