const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.STAR_EMAIL,
    pass: process.env.STAR_PASS,
  },
});

let MainGenerator = new Mailgen({
  theme: "neopolitan",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

exports.email = function (user, password) {
  let response = {
    body: {
      name: user.name,
      intro: `Your account has been created on the STAR-APP!`,
      table: {
        data: [
          {
            Email: user.email,
            Password: password,
          },
        ],
      },
      outro: "Looking forward to see you on STAR APP.",
    },
  };

  let mail = MainGenerator.generatePlaintext(response);

  let details = {
    from: "starapp.incedo@gmail.com",
    to: user.email,
    subject: "STAR APP: Account Created",
    text:
      "Your account has been created on the STAR-APP! Your Credentials are:\nEmail: " +
      user.email +
      "\nPassword: " +
      password +
      "\nLooking forward to see you on STAR APP.\n\nRegards\nSTAR APP",
  };

  mailTransporter
    .sendMail(details)
    .then(() => {
      console.log("Credentials Sent!");
    })
    .catch((error) => {
      console.log(error);
    });
};
