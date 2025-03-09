const express = require("express");
const Router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const { sendmessage, allmessage} = require("../Controllers/messageController");


Router.post('/sendmessage',protect,sendmessage);
Router.get('/:chatId',protect,allmessage);

module.exports = Router;