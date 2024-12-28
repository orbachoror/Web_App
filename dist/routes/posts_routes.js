"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const posts_controller_1 = __importDefault(require("../controllers/posts_controller"));
router.post("/", posts_controller_1.default.createPost);
router.get("/", posts_controller_1.default.getAllPosts);
router.get("/:id", posts_controller_1.default.getById);
router.put("/:id", posts_controller_1.default.updatePostById);
router.delete("/:id", posts_controller_1.default.deletePostById);
router.delete("/", posts_controller_1.default.deleteAllPosts);
exports.default = router;
//# sourceMappingURL=posts_routes.js.map