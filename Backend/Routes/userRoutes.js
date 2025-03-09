const express = require("express");
const {SignUpUser,Authuser, allUsers} = require("../Controllers/userController");
const {protect} = require("../middleware/authMiddleware");
const Router = express.Router();
 Router.post('/signup',SignUpUser);
Router.post('/login',Authuser);
Router.get('/',protect,allUsers);



module.exports = Router;