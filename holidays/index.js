const express = require("express");
const HolidaysController = require("./holidays.controller");

const router = express.Router();

router.get("/all", HolidaysController.all);
router.post("/save", HolidaysController.save);
router.delete("/remove/:id", HolidaysController.remove);
router.put("/update/:id", HolidaysController.update);
router.get("/allCountries", HolidaysController.allCountries);
router.get("/:country", HolidaysController.presentCountry);

module.exports = router;
