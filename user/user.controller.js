// Import necessary modules and models
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const ProjectModel = require("../models/project");

// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Function to get all users
exports.getAllUsers = async function (req, res) {
  const users = await UserModel.find({});
  res.send(users);
};

// Function to change user password
exports.changePassword = async function (req, res) {

  // Extract the password from the request body
  const password = req.body.password;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);

  // Find the user by email and update the password
  UserModel.findOneAndUpdate({ email: req.user.email }, { password: hashedPass });

  // Send a success message
  res.send({
    message: "Password Changed!"
  });
};

// Function to get user profile
exports.profile = async function (req, res) {
  // Find the user by email and send the user data
  const user = await UserModel.findOne({ email: req.user.email });
  res.send(user);
};

// Function to check if the user is a manager
exports.isManager = async function (req, res) {

  // Find the user based on the provided email
  user = await UserModel.findOne({ email: req.user.email });

  // Find projects associated with the user as a manager
  projects = await ProjectModel.find({ managerID: user._id });

  // Check if the user is a manager based on the number of projects associated with them
  if (projects.length == 0) {
    res.send({
      manager: false
    })
  }

  else {
    res.send({
      manager: true
    })
  }
}

// Function to check if the user is a manager
exports.checkManager = async function (req, res) {

  // Find the user based on the provided email
  let user = await UserModel.findOne({ email: req.body.email });
  let projects;

  if (user) {
    // Find projects associated with the user as a manager
    projects = await ProjectModel.find({ managerID: user._id });
  }

  else {
    projects = [];
  }

  // Check if the user is a manager based on the number of projects associated with them
  if (projects.length == 0) {
    res.send({
      manager: false
    })
  }

  else {
    res.send({
      manager: true
    })
  }
}

// Function to check if the user is a registered on STAR APP
exports.checkUser = async function (req, res) {

  // Find the user based on the provided email
  let user = await UserModel.findOne({ email: req.body.email });

  if (user) {
    res.send({
      user: true
    })
  }

  else {
    res.send({
      user: false
    })
  }
}

// Function to check if the user is an admin
exports.isAdmin = async function (req, res) {
  // Find the user based on the provided email
  const user = await UserModel.findOne({ email: req.user.email });

  // Send the response indicating whether the user is an admin
  res.send({ isAdmin: user.isAdmin });
};

// Function to handle user signup
exports.signup = async function (req, res) {
  // Extract the password from the request body
  const password = req.body.password;

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);

  // Update the request body with the hashed password
  req.body.password = hashedPass;

  // Set a default image URL
  const defaultImageUrl =
    "https://res.cloudinary.com/djtkzefmk/image/upload/v1696911605/STAR-APP/default_b7rfeq.png";

  // Create a new user data instance with the provided data
  const userdata = new UserModel({
    ...req.body,
    image: {
      url: req.body.image || defaultImageUrl,
      filename: null,
    }, // Use the provided image or the default URL
  });

  // Save the user data to the database
  userdata.save().then(
    (data) => {
      console.log("User Registered Successfully: ", data);

      // Send a confirmation email to the user
      mailer.email(data, password);

      // Send the success message after successful registration
      res.send({
        message: "User Registered!",
      });
    },
    (error) => {
      console.log("Error While Saving the Data", error);

      // Handle duplicate user registration error and other errors
      error.code == 11000
        ? res.status(409).send({ message: "Already Registered" })
        : res.status(500).send({ message: "Internal Server Error" });
    }
  );
};

// Function to handle user login
exports.login = async function (req, res) {
  // Find the user in the database using the provided email
  const user = await UserModel.findOne({ email: req.body.email });

  // Check if the user exists
  if (user == null) {
    return res.status(400).send("User Not Found!");
  }

  try {
    // Compare the provided password with the stored hashed password
    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // If the password is incorrect, return an error message
    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Prepare the payload for the JWT token
    const payload = { email: user.email };

    // Generate a JWT token with the payload and the access token secret
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Send the success message along with the token
    res.status(200).json({
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    // If an error occurs during the process, send a 500 status with the error message
    res.status(500).json(error.message);
  }
};

// Function to handle image upload for a user
exports.uploadImage = async function (req, res) {

  // Retrieve the user from the database
  UserModel.findOneAndUpdate(
    { email: req.user.email },
    {
      image: {
        url: req.file.path, // Save the path of the uploaded image
        filename: req.file.filename, // Save the filename of the uploaded image
      },
    }
  ).then(
    (data) => {
      res.send({
        message: "Image Uploaded!",
      });
    },
    (error) => {
      res.send({
        message: "Error while saving image!",
      });
    }
  );
};
