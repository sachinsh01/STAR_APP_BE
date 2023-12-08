// Import necessary modules and controllers
const express = require("express");
const UserController = require("./user.controller");
const middlewares = require("../middlewares/checkAuth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Create an instance of the express Router
const router = express.Router();

// Define routes for various user operations
router.get("/get", UserController.getAllUsers); // Route to get all users
router.get("/isAdmin", middlewares.checkAuth, UserController.isAdmin); // Route to check if the user is an admin
router.get("/profile", middlewares.checkAuth, UserController.profile); // Route to get user profile
router.get("/isManager", middlewares.checkAuth, UserController.isManager); // Route to check if the current user is a manager
router.post(
  "/CheckManager",
  middlewares.checkAuth,
  UserController.checkManager
); // Route to check if the another user is a manager
router.post("/CheckUser", middlewares.checkAuth, UserController.checkUser); // Route to check if a user is a registered or not on STAR APP
router.post("/password", middlewares.checkAuth, UserController.changePassword); // Route to change the user's password
router.post("/signup", UserController.signup); // Route for user signup
router.post("/login", UserController.login); // Route for user login
router.post(
  "/image",
  upload.single("photo"),
  middlewares.checkAuth,
  UserController.uploadImage
); // Route to upload user image
router.get("/getHolidays", middlewares.checkAuth, UserController.getHolidays); //Route to get holidays of an User

// Export the router to be used in the application
module.exports = router;
