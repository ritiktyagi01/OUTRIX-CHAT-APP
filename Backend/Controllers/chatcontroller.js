const asynchandler = require("express-async-handler");
const User  = require('../models/usermodels');
const chat = require("../models/chatmodel");

const accessChat = asynchandler(async(req,res)=>{
    const{userId} = req.body;

    if(!userId){
        console.log("provide user ID");
        return res.sendStatus(400);
    }

    var Ischat = await chat.findOne({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch :{$eq:req.user._id}}},
            {users:{$elemMatch :{$eq:userId}}},
        ],

    }).populate("users","-password")
    .populate("latestMessage")
    .populate("latestMessage.sender", "-password")

   

    if(Ischat){
        res.status(200).send(Ischat);
    }
    else{
        var newChat = {
            chatname:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],

        };

        try{
        const createdchat = await chat.create(newChat);
        
        const fullChat = await chat.findById(createdchat._id).populate("users", "-password");

        res.send(fullChat);
        }catch(error){
            res.status(400).send(error);

        }
        
    }


});


const fetchChats  = asynchandler(async(req,res)=>{

    const allusers =  await chat.find( {users:{$elemMatch :{$eq:req.user._id}}}).populate("users","-password")
    .populate("latestMessage")
     .populate("latestMessage.sender", "-password")

    res.send(allusers)


})


const CreateGroupChat = asynchandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "Please fill all fields"})
    }


var Gusers = JSON.parse(req.body.users);

    if(Gusers.length<2){
        return res.status(400).send({message:"more than two users should be to make a group chat"});

    }

Gusers.push(req.user);

try{
    const createdchat = await chat.create ({
        chatname : req.body.name ,
        isGroupChat:true,
        users:Gusers,
        groupAdmin:req.user,


    });

    const groupChat = await chat.findOne({
        _id : createdchat._id
    }).populate("users","-password")
    .populate("groupAdmin","-password");
    res.send(groupChat);
    
    
} catch(error){
    return res.status(400).send(error);

}

});


const RenameGroupChat = asynchandler(async(req,res)=>{
    const {chatId,newname} = req.body;
    

    try{
        const updatedChat = await chat.findOneAndUpdate({_id:chatId} ,{
            chatname:newname},
            {new:true}
        ).populate("users","-password")
        .populate("groupAdmin","-password");
        if (!updatedChat) {
            return res.status(404).send({ message: "Chat not found" });
        }

        res.status(200).json(updatedChat);

    }catch(error){
        return res.status(400).send(error);


    }
});

const AddToGroupChat = asynchandler(async(req,res)=>{
    const {chatId,UserId} = req.body;

    if (!chatId || !UserId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }
    

try{

    const updateduser = await chat.findOneAndUpdate({_id:chatId},
        {$push :{users:UserId} },
        {new:true}
    
    ).populate("users","-password")
    .populate("groupAdmin","-password");
    res.status(200).json(updateduser);

    

}catch(error)
{
    return res.status(400).send(error);

}

});

const RemoveFromGroupChat =  asynchandler(async(req,res)=>{
    const {chatId,UserId} = req.body;
    if (!chatId || !UserId) {
        return res.status(400).json({ message: "chatId and userId are required" });
    }

    try{
        const removeuser = await chat.findOneAndUpdate(
            {_id: chatId},
           {$pull: { users: UserId }},
             {    new:true  }

).populate("users","-password")
.populate("groupAdmin","-password");
res.status(200).json(removeuser);


    }catch(error){
        return res.status(400).send(error);
    }

})

module.exports = {accessChat,fetchChats,CreateGroupChat,RenameGroupChat,AddToGroupChat,RemoveFromGroupChat};