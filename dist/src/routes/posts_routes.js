"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth_controller");
const posts_controller_1 = __importDefault(require("../controllers/posts_controller"));
const router = express_1.default.Router();
router.post("/", auth_controller_1.authTestMiddleware, posts_controller_1.default.createItem.bind(posts_controller_1.default));
router.get("/", posts_controller_1.default.getAll.bind(posts_controller_1.default));
router.get("/:id", posts_controller_1.default.getById.bind(posts_controller_1.default));
router.put("/:id", auth_controller_1.authTestMiddleware, posts_controller_1.default.updateItemById.bind(posts_controller_1.default));
router.delete("/:id", auth_controller_1.authTestMiddleware, posts_controller_1.default.deleteItem.bind(posts_controller_1.default));
exports.default = router;
//# sourceMappingURL=posts_routes.js.map