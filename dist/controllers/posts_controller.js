var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PostModel = require("../models/posts_models");
const createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const postBody = req.body;
    try {
        const post = yield PostModel.create(postBody);
        res.status(201).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const ownerFilter = req.query.owner;
    try {
        if (ownerFilter) {
            const posts = yield PostModel.find({ owner: ownerFilter });
            res.status(200).send(posts);
            return;
        }
        const posts = yield PostModel.find({});
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield PostModel.findById(id);
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const updatePostById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    const postBody = req.body;
    try {
        const post = yield PostModel.findByIdAndUpdate(id, postBody, { new: true, runValidators: true });
        // Check if the post was found and updated
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deletePostById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield PostModel.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deleteAllPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const posts = yield PostModel.deleteMany({});
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
module.exports = { createPost, getAllPosts, getById, updatePostById, deletePostById, deleteAllPosts };
//# sourceMappingURL=posts_controller.js.map