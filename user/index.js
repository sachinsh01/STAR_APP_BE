var express = require("express");
var UserController = require("./user.controller");
const middlewares = require("../middlewares/checkAuth");
var multer = require("multer");
const { storage } = require("../cloudinary");
var upload = multer({storage});

var router = express.Router();

router.get("/get", UserController.getAllUsers);
router.get("/isAdmin", middlewares.checkAuth, UserController.isAdmin);
router.get("/isLoggedin", middlewares.checkAuth, UserController.isLoggedin);
router.get("/profile", middlewares.checkAuth, UserController.profile);
router.post("/password", middlewares.checkAuth, UserController.changePassword);
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.post("/image", upload.single("photo"), middlewares.checkAuth, UserController.uploadImage); //Pending: Create an input field on the form with a name photo. Also, set enctype ="multipart/form-data"

//router.get("/logout", UserController.logout)

/* router.get("/info", middlewares.checkAuth, (req, res) => {
    console.log(req.user)
    res.send("You're in :)")
}) */

module.exports = router;
