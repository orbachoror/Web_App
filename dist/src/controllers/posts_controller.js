"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_models_1 = __importDefault(require("../models/posts_models"));
const base_controller_1 = __importDefault(require("./base_controller"));
const postsController = (0, base_controller_1.default)(posts_models_1.default);
exports.default = postsController;
//# sourceMappingURL=posts_controller.js.map