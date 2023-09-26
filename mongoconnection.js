if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

var mongoose = require("mongoose"); //ETL: Extract Transform Load
var dbURL = process.env.DB_URL
var dbLocal = 'mongodb://localhost:27017/STAR-APP'


mongoose.connect(dbURL).then(() => {
    console.log("Connected to database through mongoose.")
});