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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = Object.assign({}, req.query);
            try {
                const data = yield this.model.find(filter);
                res.status(200).send(data);
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    ;
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const date = yield this.model.findById(id);
                if (date) {
                    res.send(date);
                }
                else {
                    res.status(404).send("item not found");
                }
            }
            catch (error) {
                res.status(400).send(error.message);
            }
        });
    }
    ;
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.create(req.body);
                res.status(201).send(data);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            console.log("the id is  " + id);
            try {
                const deleteedPost = yield this.model.deleteOne({ _id: id });
                if (deleteedPost.deletedCount === 0) {
                    res.status(400).send({ message: "Post not found" });
                }
                else
                    res.status(200).send("item deleted");
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.create(req.body);
                res.status(201).send(data);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    ;
    updateItemById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updateData = req.body;
            try {
                const updatedItem = yield this.model.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true
                });
                if (!updatedItem) {
                    return res.status(401).json({ message: "Item not found" });
                }
                res.status(200).json(updatedItem);
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.BaseController = BaseController;
;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map