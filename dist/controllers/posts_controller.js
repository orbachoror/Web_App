"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_models_1 = __importDefault(require("../models/posts_models"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postBody = req.body;
    try {
        const post = yield posts_models_1.default.create(postBody);
        res.status(201).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    try {
        const posts = yield posts_models_1.default.find(filter);
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield posts_models_1.default.findById(id);
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const postBody = req.body;
    try {
        const post = yield posts_models_1.default.findByIdAndUpdate(id, postBody, { new: true, runValidators: true });
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
});
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield posts_models_1.default.findByIdAndDelete(id);
        if (!post) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        res.status(200).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deleteAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield posts_models_1.default.deleteMany({});
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = { createPost, getAllPosts, getById, updatePostById, deletePostById, deleteAllPosts };
//# sourceMappingURL=posts_controller.js.map