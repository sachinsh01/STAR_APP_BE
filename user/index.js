var express = require("express");
var UserController = require("./user.controller");
const middlewares = require("../middlewares/checkAuth");

var router = express.Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
//router.get("/logout", UserController.logout);

router.get("/info", middlewares.checkAuth, (req, res) => {
    console.log(req.user)
    res.send("You're in :)")
})

module.exports = router;