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
    const ownerFilter = req.query.owner;
    try{
        if(ownerFilter){
            const posts=await PostModel.find({owner:ownerFilter});
            res.status(200).send(posts);
            return;
        }
        const posts=await PostModel.find({});
        res.status(200).send(posts);
    }catch(err){
        res.status(400).send(err);
    }
};


const getById = async(req,res) => {
    const id =req.params.id;
    try{
        const post=await PostModel.findById(id);
        res.status(200).send(post);
    }catch(err){
        res.status(400).send(err);
    }
};


module.exports={createPost,getAllPosts,getById};
