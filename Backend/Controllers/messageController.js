const asynchandler = require("express-async-handler");
const User  = require('../models/usermodels');
const Chat = require("../models/chatmodel");
const Message = require("../models/messagemodel");

const sendmessage = async(req, res) => {
    console.log(req.body);

    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data");
        return res.sendStatus(404);
    }

    var newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newmessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    
        res.json(message);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    
};

const allmessage = async(req,res)=>{
    try{
    const allchats = await Message.find({chat:req.params.chatId}).populate("sender" , "name pic").populate("chat");
    res.json(allchats);
}

catch(error){
    console.log(error);

}
}

module.exports = { sendmessage,allmessage};

