const PostModel = require("../models/posts_models");

const createPost = async (req, res) => {
    const postBody = req.body;
    try {
        const post = await PostModel.create(postBody);
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAllPosts = async (req, res) => {
    const filter = req.query;
    try {
        const posts = await PostModel.find(filter);
        res.status(200).send(posts);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id);
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updatePostById = async (req, res) => {
    const id = req.params.id;
    const postBody = req.body;
    try {
        const post = await PostModel.findByIdAndUpdate(id, postBody, { new: true, runValidators: true });
        // Check if the post was found and updated
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
};
const deletePostById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};
const deleteAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.deleteMany({});
        res.status(200).send(posts);
    } catch (err) {
        res.status(400).send(err);
    }
};


module.exports = { createPost, getAllPosts, getById, updatePostById, deletePostById, deleteAllPosts };
