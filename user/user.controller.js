var UserModel = require("../models/user")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

exports.signup = async function(req, res) {

    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    req.body.password = hashedPass;

    var userdata = new UserModel(req.body)

    userdata.save().then((data) => {
        console.log("User Registered Successfully: ", data)
        res.send({
            message: "User Registered"
        })
    }, (error) => {
        console.log("Error While Saving the Data", error)
        error.code == 11000 ? res.status(409).send({message: "Already Registered"}) : res.status(500).send({message: "Internal Server Error"})
    })

    //res.status(200).send("ok")
}

exports.login = async function(req, res) {

    const user = await UserModel.findOne({ email: req.body.email });

    if (user == null) {
        return res.status(400).send("User Not Found!");
    }

    try {

        const isCorrectPassword = await bcrypt.compare(req.body.password, user.password)

        if(!isCorrectPassword) {
            return res.status(400).json({message: "Incorrect Password"})
        }


        payload = {email: user.email}
            
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"})

        res.cookie("token", token, {
            httpOnly: true
        }).status(200).json({
            message: "Login Successfull",
            token: token
        })
    }

    catch(error) {
        res.status(500).json(error.message)
    }    
}

/* exports.logout = async function(req, res) {
    res.clearCookie("token")
    res.status(200).json({message: "Logout Successfully"})
} */