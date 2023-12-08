const HolidaysModel = require("../models/holidays");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// API to find all holidays
exports.all = async function (req, res) {
  try {
    const holidays = await HolidaysModel.find({}).sort({ date: 1 }); //Sort in ascending order

    res.send(holidays);
  } catch (error) {
    console.log(error);
    res.send(500).send("Server Error");
  }
};
// API to save new holiday
exports.save = async function (req, res) {
  const newHoliday = new HolidaysModel({
    name: req.body.name,
    date: req.body.date,
    locations: req.body.locations,
  });

  newHoliday
    .save()
    .then(() => {
      res.send({ holiday: newHoliday });
    })
    .catch((error) => {
      console.log("Error in saving holiday", error);
      res.send(error);
    });
};
// API to update existing holiday
exports.update = async function (req, res) {
  try {
    const holiday = await HolidaysModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!holiday) {
      return res.status(404).send("Holiday not found");
    }
    return res.send({ holiday: holiday });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
// API to remove holiday
exports.remove = async function (req, res) {
  try {
    const holiday = await HolidaysModel.findByIdAndRemove(req.params.id);

    if (!holiday) {
      return res.status(404).send("Holiday not found");
    }

    return res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

// API to send list of locations
exports.allCountries = async function (req, res) {
  try {
    const locations = [
      {
        country: "India",
        cities: [
          "All",
          "Gurugram",
          "Hyderabad",
          "Chennai",
          "Pune",
          "Bangalore",
        ],
      },
      {
        country: "USA",
        cities: ["All", "Santa Clara", "Boston", "New Jersey", "Dallas"],
      },

      { country: "Mexico", cities: ["Guadalajara"] },
      { country: "Canada", cities: ["Mississauga"] },
    ];

    res.send(locations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.presentCountry = async function (req, res) {
  try {
    const country = req.params.country;

    const holidays = await HolidaysModel.find({
      [`locations.${country}`]: { $exists: true },
    });

    res.send(holidays);
  } catch (error) {
    console.log("Error in getting location for the country", error);
    res.status(500).send({ error });
  }
};
