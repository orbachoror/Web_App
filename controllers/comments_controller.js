const Comment= require("../models/comments_models");

const createComments = async(req,res) => {
    try{
        const format =req.body;
        const comment= new Comment(format);
        await comment.save();
        res.status(201).send(comment);
    }catch (err){
        res.status(400).send(err); 
    }
};


const getComments = async(req,res) => {
    const authorFilter = req.query.author;
    try{
        if(authorFilter){
            const comments=await Comment.find({author:authorFilter});
            res.status(200).send(comments);
            return;
        }
        const comments=await Comment.find({});
        res.status(200).send(comments);
    }catch(err){
        res.status(400).send(err);
    }
};

/*
const deleteComments = async(req,res) => {
    const id =req.params.id;
    try{
        const post=await PostModel.findById(id);
        res.status(200).send(post);
    }catch(err){
        res.status(400).send(err);
    }
};


const updateComments = async(req,res) => {
    const id=req.params.id;
    const postBody=req.body;
    try{
        const post=await PostModel.findByIdAndUpdate(id,postBody,{new:true,runValidators: true});
        res.status(200).send(post);
            // Check if the post was found and updated
    if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
    }
    catch(err){
        res.status(400).send(err);
    }
};

*/
module.exports={
    createComments,
    getComments,
    //deleteComments,
    //updateComments
    };
