const express = require("express");
const Router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {accessChat,fetchChats, CreateGroupChat, RenameGroupChat, AddToGroupChat, RemoveFromGroupChat} = require("../Controllers/chatcontroller");

Router.post('/',protect,accessChat);
Router.get('/',protect,fetchChats);
Router.post('/group',protect,CreateGroupChat);
Router.put('/rename',protect,RenameGroupChat);
Router.put('/addtogroup',protect,AddToGroupChat);
Router.put('/removefromgroup',protect,RemoveFromGroupChat);





module.exports = Router;