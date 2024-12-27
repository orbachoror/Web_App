import PostModel from "../models/posts_models";
import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {
    const postBody = req.body;
    try {
        const post = await PostModel.create(postBody);
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

const getAllPosts = async (req: Request, res: Response) => {
    const filter = req.query;
    try {
        const posts = await PostModel.find(filter);
        res.status(200).send(posts);
    } catch (err) {
        res.status(400).send(err);
    }
};


const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id);
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updatePostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const postBody = req.body;
    try {
        const post = await PostModel.findByIdAndUpdate(id, postBody, { new: true, runValidators: true });
        // Check if the post was found and updated
        if (!post) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
};
const deletePostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findByIdAndDelete(id);
        if (!post) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        res.status(200).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};
const deleteAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await PostModel.deleteMany({});
        res.status(200).send(posts);
    } catch (err) {
        res.status(400).send(err);
    }
};


export default { createPost, getAllPosts, getById, updatePostById, deletePostById, deleteAllPosts };