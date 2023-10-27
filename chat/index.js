const express = require("express");
const ChatController = require("./chat.controller");
const middlewares = require("../middlewares/checkAuth");

const router = express.Router();

router.post("/", ChatController.chatResponse);

module.exports = router;
