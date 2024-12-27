var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Comment = require("../models/comments_models");
const Post = require("../models/posts_models");
const createComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const format = req.body;
        const postExists = yield Post.findById(format.postId);
        if (!postExists) {
            return res.status(404).send({ message: "Post not found" });
        }
        const comment = yield Comment.create(format);
        res.status(201).send(comment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const comments = yield Comment.find({});
        res.status(200).send(comments);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getCommentsByAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const AuthorFilter = req.query.author;
    try {
        if (AuthorFilter) {
            const comments = yield Comment.find({ author: AuthorFilter });
            res.status(200).send(comments);
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getCommentsById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const IdFilter = req.params.id;
    try {
        if (IdFilter) {
            const comments = yield Comment.findById(IdFilter);
            res.status(200).send(comments);
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getCommentsByPostId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const PostIdFilter = req.params.postId;
    try {
        if (PostIdFilter) {
            const comments = yield Comment.find({ postId: PostIdFilter });
            res.status(200).send(comments);
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deleteCommentsById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const ID = req.params.id;
    try {
        const delteComment = yield Comment.findByIdAndDelete(ID);
        res.status(200).send(delteComment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const updateCommentsById = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const ID = req.params.id;
    const comment = req.body;
    try {
        const update = yield Comment.findByIdAndUpdate(ID, comment, { new: true, runValidators: true });
        if (!update) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res.status(200).send(update);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
module.exports = {
    createComments,
    getAllComments,
    getCommentsById,
    getCommentsByAuthor,
    getCommentsByPostId,
    deleteCommentsById,
    updateCommentsById
};
//# sourceMappingURL=comments_controller.js.map