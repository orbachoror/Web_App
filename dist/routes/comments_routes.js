"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
router.post("/", comments_controller_1.default.createComments); //create
router.get("/", comments_controller_1.default.getAllComments); //read
router.get("/:id", comments_controller_1.default.getCommentsById); //read
router.delete("/:id", comments_controller_1.default.deleteCommentsById); //delete
router.put("/:id", comments_controller_1.default.updateCommentsById); // update
exports.default = router;
//# sourceMappingURL=comments_routes.js.map