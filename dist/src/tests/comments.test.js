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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const comments_models_1 = __importDefault(require("../models/comments_models"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield comments_models_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
let commentId;
const testComment1 = {
    comment: "First Test comment1",
    owner: "Or",
    postId: "1"
};
const testCommentFail = {
    comment: "InvalidTest title",
};
describe("Comments test suite", () => {
    test("Comments test get all Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Test adding new comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment1);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment1.comment);
        expect(response.body.owner).toBe(testComment1.owner);
        commentId = response.body._id;
    }));
    test("Test adding invalid comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testCommentFail);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get all comment after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test get comment by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment1.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testComment1.owner);
    }));
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("Test get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId + 5);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get comment by fail id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map