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
const user_models_1 = __importDefault(require("../models/user_models"));
let app;
const testUser = {
    email: "test@user.com",
    password: "123456",
    token: ""
};
let postId = "";
const testComment = {
    comment: "Test comment",
    postId: "First Test",
    owner: "Or",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield comments_models_1.default.deleteMany();
    yield user_models_1.default.deleteMany();
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(200);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    expect(response2.statusCode).toBe(200);
    testUser.token = response2.body.token;
    testComment.owner = response2.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
const invalidComment = {
    comment: "First Test"
};
describe("Comments test suite", () => {
    test("Comment test get all Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Test adding new comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").set({
            authorization: "JWT " + testUser.token,
        }).send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(testComment.owner);
        expect(response.body.comment).toBe(testComment.comment);
        postId = response.body._id;
    }));
    test("Test adding invalid comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").set({
            authorization: "JWT " + testUser.token,
        }).send(invalidComment);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get all comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test get comments by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testComment.owner);
    }));
    test("Test get comments by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Test get comments by fail id-1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + postId + 5);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get comments by fail id-2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    }));
    test("Update comments test by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateComments = {
            comment: "Updated comment",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + postId)
            .set({
            authorization: "JWT " + testUser.token
        })
            .send(updateComments);
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updateComments.comment);
    }));
    test("Comments Delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/comments/" + postId)
            .set({
            authorization: "JWT " + testUser.token
        });
        expect(response.statusCode).toBe(200);
        const respponse2 = yield (0, supertest_1.default)(app).get("/comments/" + postId);
        expect(respponse2.statusCode).toBe(404);
        const respponse3 = yield (0, supertest_1.default)(app).get("/comments/" + postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map