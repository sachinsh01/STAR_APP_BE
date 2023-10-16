const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../cloudinary");
const mailer = require("../helpers/mailer");
var ProjectModel = require("../models/project");


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

exports.getAllUsers = async function (req, res) {
  const users = await UserModel.find({});

  res.send(users);
};

exports.changePassword = async function (req, res) {

  const password = req.body.password;

  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);

  const users = await UserModel.findOneAndUpdate({email: req.user.email }, {password: hashedPass});

  res.send({
    message: "Password Changed!"
  })
}

exports.profile = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  res.send(user);
}

exports.isManager = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });
  
  const projects = await ProjectModel.find({managerID: user._id});

  if(projects.length == 0) {
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

exports.isAdmin = async function (req, res) {
  const user = await UserModel.findOne({ email: req.user.email });

  res.send({ isAdmin: user.isAdmin });
};

exports.signup = async function (req, res) {

  console.log("hey")

  const password = req.body.password;

  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);

  req.body.password = hashedPass;

  const defaultImageUrl = "https://res.cloudinary.com/djtkzefmk/image/upload/v1696911605/STAR-APP/default_b7rfeq.png";

  var userdata = new UserModel({
    ...req.body,
    image: {
      url: req.body.image || defaultImageUrl,
      filename: null
    } // Use the provided image or the default URL
  });

  userdata.save().then(
    (data) => {
      console.log("User Registered Successfully: ", data);

      mailer.email(data, password);

      res.send({
        message: "User Registered!",
      });
    },
    (error) => {
      console.log("Error While Saving the Data", error);
      error.code == 11000
        ? res.status(409).send({ message: "Already Registered" })
        : res.status(500).send({ message: "Internal Server Error" });
    }
  );

  //res.status(200).send("ok")
};

exports.login = async function (req, res) {
  const user = await UserModel.findOne({ email: req.body.email });

  if (user == null) {
    return res.status(400).send("User Not Found!");
  }

  try {
    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isCorrectPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    payload = { email: user.email };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    /*res.cookie("token", token, {
            httpOnly: true
        }).status(200).json({
            message: "Login Successfull"
        })*/

    res.status(200).json({
      message: "Login Successfull",
      token: token,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.uploadImage = async function (req, res) {

  /* if (user.image.filename) {
    await cloudinary.uploader.destroy(user.image.filename);
  } */
  
  const user = await UserModel.findOneAndUpdate({ email: req.user.email }, {image: {
    url: req.file.path,
    filename: req.file.filename,
  }}).then(
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

  


/* exports.logout = async function(req, res) {
    res.clearCookie("token")
    res.status(200).json({message: "Logout Successfully"})
} */
