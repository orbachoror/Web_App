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
const comments_models_1 = __importDefault(require("../models/comments_models"));
const posts_models_1 = __importDefault(require("../models/posts_models"));
const createComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const format = req.body;
        const postExists = yield posts_models_1.default.findById(format.postId);
        if (!postExists) {
            res.status(404).send({ message: "Post not found" });
            return;
        }
        const comment = yield comments_models_1.default.create(format);
        res.status(201).send(comment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    try {
        const comments = yield comments_models_1.default.find(filter);
        res.status(200).send(comments);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const IdFilter = req.params.id;
    try {
        if (IdFilter) {
            const comments = yield comments_models_1.default.findById(IdFilter);
            res.status(200).send(comments);
            return;
        }
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const deleteCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.id;
    try {
        const delteComment = yield comments_models_1.default.findByIdAndDelete(ID);
        res.status(200).send(delteComment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const updateCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ID = req.params.id;
    const comment = req.body;
    try {
        const update = yield comments_models_1.default.findByIdAndUpdate(ID, comment, { new: true, runValidators: true });
        if (!update) {
            res.status(404).send({ message: "Comment not found" });
            return;
        }
        res.status(200).send(update);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = { createComments, getAllComments, getCommentsById, deleteCommentsById, updateCommentsById };
//# sourceMappingURL=comments_controller.js.map