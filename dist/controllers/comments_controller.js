"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_models_1 = __importDefault(require("../models/comments_models"));
const base_controller_1 = __importDefault(require("./base_controller"));
const commentsController = (0, base_controller_1.default)(comments_models_1.default);
exports.default = commentsController;
//# sourceMappingURL=comments_controller.js.map