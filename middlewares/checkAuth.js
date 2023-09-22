const jwt = require("jsonwebtoken")

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

exports.checkAuth = (req, res, next) => {

    //const token = req.cookies.token || req.body.token

    const token = req.headers["authorization"].split(" ")[1]

    if(!token) {
        return res.status(401).json({message: "Not Logged In!"})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) {
            return res.status(403).json({message: "Invalid Token!"})
        }

        //console.log(user);
        req.user = {
            email: user.email
        }

        next()
    })
}