var express = require("express")

var router = express.Router()

router.use("/user", require("./user"))
router.use("/ticket", require("./ticket"))
router.use("/project", require("./project"))

module.exports = router;