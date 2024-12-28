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
const posts_models_1 = __importDefault(require("../models/posts_models"));
const user_models_1 = __importDefault(require("../models/user_models"));
let app;
const testUser = {
    email: "test@user.com",
    password: "123456",
    token: ""
};
let postId = "";
const testPost = {
    title: "Test title",
    content: "First Test",
    owner: "Or",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield posts_models_1.default.deleteMany();
    yield user_models_1.default.deleteMany();
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(200);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    expect(response2.statusCode).toBe(200);
    testUser.token = response2.body.token;
    testPost.owner = response2.body._id;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
const invalidPost = {
    content: "First Test"
};
describe("Posts test suite", () => {
    test("Post test get all post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    }));
    test("Test adding new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: "JWT " + testUser.token,
        }).send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(testPost.owner);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        postId = response.body._id;
    }));
    test("Test adding invalid post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: "JWT " + testUser.token,
        }).send(invalidPost);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get all posts after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    }));
    test("Test get post by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?owner=" + testPost.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testPost.owner);
    }));
    test("Test get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("Test get post by fail id-1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId + 5);
        expect(response.statusCode).toBe(400);
    }));
    test("Test get post by fail id-2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    }));
    test("Posts Delete test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/posts/" + postId)
            .set({
            authorization: "JWT " + testUser.token
        });
        expect(response.statusCode).toBe(200);
        const respponse2 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(respponse2.statusCode).toBe(404);
        const respponse3 = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
    }));
    test("Update post test by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatePst = {
            title: "Updated title",
            content: "Updated content",
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/" + postId)
            .set({
            authorization: "JWT " + testUser.token
        })
            .send(updatePst);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(updatePst.content);
        expect(response.body.title).toBe(updatePst.title);
    }));
});
//# sourceMappingURL=posts.test.js.map