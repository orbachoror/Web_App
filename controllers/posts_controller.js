const PostModel= require("../models/posts_models");

const createPost = async(req,res) => {
    const postBody =req.body;
    try{
        const post=await PostModel.create(postBody);
        res.status(201).send(post);
    }catch (err){
        res.status(400).send(err); 
    }
};

const getAllPosts = async(req,res) => {
    try{
        const posts=await PostModel.find({});
        res.status(200).send(posts);
    }catch(err){
        res.status(400).send(err);
    }
};

module.exports={createPost,getAllPosts};
