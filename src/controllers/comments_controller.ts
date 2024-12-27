import Comment from "../models/comments_models";
import Post from "../models/posts_models";
import { Request, Response } from "express";

const createComments = async (req: Request, res: Response) => {
    try {
        const format = req.body;
        const postExists = await Post.findById(format.postId);
        if (!postExists) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        const comment = await Comment.create(format);
        res.status(201).send(comment);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getAllComments = async (req: Request, res: Response) => {
    const filter = req.query;
    try {
        const comments = await Comment.find(filter);
        res.status(200).send(comments);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getCommentsById = async (req: Request, res: Response) => {
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




const deleteCommentsById = async (req: Request, res: Response) => {
    const ID = req.params.id;
    try {
        const delteComment = await Comment.findByIdAndDelete(ID);
        res.status(200).send(delteComment);
    } catch (err) {
        res.status(400).send(err);
    }
};


const updateCommentsById = async (req: Request, res: Response) => {
    const ID = req.params.id;
    const comment = req.body;
    try {
        const update = await Comment.findByIdAndUpdate(ID, comment, { new: true, runValidators: true });
        if (!update) {
            res.status(404).send({ message: "Comment not found" });
            return;
        }
        res.status(200).send(update);
    }
    catch (err) {
        res.status(400).send(err);
    }
};


export default { createComments, getAllComments, getCommentsById, deleteCommentsById, updateCommentsById };
