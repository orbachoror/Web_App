const Comment = require("../models/comments_models");
const Post = require("../models/posts_models");

const createComments = async (req, res) => {
    try {
        const format = req.body;
        const postExists = await Post.findById(format.postId);
        if (!postExists) {
            return res.status(404).send({ message: "Post not found" });
        }
        const comment = await Comment.create(format);
        res.status(201).send(comment);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.status(200).send(comments);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getCommentsByAuthor = async (req, res) => {
    const AuthorFilter = req.query.author;
    try {
        if (AuthorFilter) {
            const comments = await Comment.find({ author: AuthorFilter });
            res.status(200).send(comments);
            return;
        }
    } catch (err) {
        res.status(400).send(err);
    }
}

const getCommentsById = async (req, res) => {
    const IdFilter = req.params.id;
    try {
        if (IdFilter) {
            const comments = await Comment.findById(IdFilter);
            res.status(200).send(comments);
            return;
        }
    } catch (err) {
        res.status(400).send(err);
    }
};


const getCommentsByPostId = async (req, res) => {
    const PostIdFilter = req.params.postId;
    try {
        if (PostIdFilter) {
            const comments = await Comment.find({ postId: PostIdFilter });
            res.status(200).send(comments);
            return;
        }
    } catch (err) {
        res.status(400).send(err);
    }
};


const deleteCommentsById = async (req, res) => {
    const ID = req.params.id;
    try {
        const delteComment = await Comment.findByIdAndDelete(ID);
        res.status(200).send(delteComment);
    } catch (err) {
        res.status(400).send(err);
    }
};


const updateCommentsById = async (req, res) => {
    const ID = req.params.id;
    const comment = req.body;
    try {
        const update = await Comment.findByIdAndUpdate(ID, comment, { new: true, runValidators: true });
        if (!update) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res.status(200).send(update);
    }
    catch (err) {
        res.status(400).send(err);
    }
};


module.exports = {
    createComments,
    getAllComments,
    getCommentsById,
    getCommentsByAuthor,
    getCommentsByPostId,
    deleteCommentsById,
    updateCommentsById
};
