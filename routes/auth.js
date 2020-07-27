const express = require('express');
const mongoose = require('mongoose')
const User = mongoose.model("User")
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()

// router.get("/protected",requireLogin,(req,res)=>{
//     res.send(`Hello ${req.user.name}`);
// })

router.post('/signup',(req,res)=>{
    const {name,email,password,photo} = req.body;
    if(!email || !name || !password){
        return res.status(422).json({error:"please add all the fields"})
    }

    User.findOne({email:email})
    .then(saveduser=>{
        if(saveduser){
            return res.status(422).json({error:"user already exists with that email"})
        }
    })
    const user = new User({
        email,
        password,
        name,
        photo
    })

    user.save()
    .then(user=>res.json({message:"saved successfully"}))
    .catch(err=>console.log(err));

})

router.post('/login',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }

    User.findOne({email:email})
    .populate({ path: 'following', select: '-password' })
    .then(saveduser=>{
        if(!saveduser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        if(saveduser.password === password )
        {
            const token = jwt.sign({_id:saveduser._id},JWT_SECRET)
            const {_id,name,email,photo,followers,following} = saveduser
            res.json({token,user:{_id,name,email,photo,followers,following}});
        }
        else{
            return res.status(422).json({error:"Invalid Email or password"})
        }
    })
    .catch(err=>console.log(err));
})

module.exports = router