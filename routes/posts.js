const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")

router.get('/home', (req, res) => {
    res.send("hello node world")
})

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>console.log(err));
})

router.get('/followingposts',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts});
    })
    .catch(err=>console.log(err));
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {caption,photo} = req.body;
    if(!caption || !photo){
        return  res.status(422).json({error:"Plase add all the fields"})
      }
    req.user.password=undefined;
    const post = new Post({
        caption,
        photo,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/post/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .exec((err,post)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(post)
    })
})


router.get('/mypost',requireLogin,(req,res)=>{
    const posts = Post.find({postedBy:req.user._id});
    posts.populate("postedBy","_id name")
    .then(myposts=>{
        res.json({myposts});
    })
    .catch(err=>console.log(err));
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true})
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true})
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name photo")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{new:true})
    .populate("comments.postedBy","_id name photo")
    .populate("postedBy","_id name photo")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router