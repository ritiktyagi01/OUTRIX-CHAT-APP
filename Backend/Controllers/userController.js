const asynchandler = require("express-async-handler");
const User  = require('../models/usermodels');
const bcrypt = require("bcryptjs");

const generatetoken = require('../config/generatetoken');


const SignUpUser = asynchandler(async(req,res) =>{
    const {name,email,password,pic} = req.body;

    if(!name || !email || !password ){
        return res.status(400).json("enter all field");

    }

    const userExist = await User.findOne({email});


    if(userExist){
        return res.status(400).json("User already exists");

    }

    const user  = await User.create({
        name,
        email,
        password,
        pic
    
    
    });

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token:generatetoken(user._id)
        });

    }
    else{
        res.status(400);
        throw new Error("Failed to create the user");

    }

   

});


const Authuser = asynchandler(async(req,res) =>{
    const {email,password}= req.body;

    const user = await User.findOne({email});


    if(user && (await bcrypt.compare(password,user.password))){
        
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generatetoken(user._id)
        });

    }

    else{
        res.status(401).json({message:"user Not Found"});


    }



});


const allUsers = asynchandler(async(req,res) =>{
const Keyword = req.query.search ? {
    $or :[
        {name:{$regex:req.query.search,$options:"i"} },
        {email:{$regex:req.query.search,$options:"i"} },

    ]
} : {};

const users = await User.find(Keyword).find({_id:{$ne : req.user._id}});
res.send(users);

});



  

module.exports = {SignUpUser,Authuser,allUsers}