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
const user_models_1 = __importDefault(require("../models/user_models"));
const posts_models_1 = __importDefault(require("../models/posts_models"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_models_1.default.deleteMany({});
    yield posts_models_1.default.deleteMany({});
    console.log('beforeAll');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
const userInfo = {
    email: "orbachor@gmail.com",
    password: "123"
};
const invalidUserInfo = {
    email: "orbachor@gmail.com",
    password: ""
};
describe("Auth tests", () => {
    test("Auth Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    }));
    test("Auth Registration fail without password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(invalidUserInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Registration fail with exists email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Missing refresh token in logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({});
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Refresh token is required");
    }));
    jest.spyOn(user_models_1.default, "findOne").mockImplementationOnce(() => {
        throw new Error("Database error");
    });
    test("Login handles database error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
        // Assert the response
        expect(response.statusCode).not.toBe(200); // Check that the error is caught and a 400 response is returned
    }));
    test("Auth Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        const refreshToken = response.body.refreshToken;
        const userId = response.body._id;
        expect(token).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(userId).toBeDefined();
        userInfo.token = token;
        userInfo.refreshToken = refreshToken;
        userInfo._id = userId;
    }));
    test("Auth Login fail without password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(invalidUserInfo);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Login fail with correct password and false email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: userInfo.email + "1", password: userInfo.password });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Auth Login fail with correct email and false password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({ email: userInfo.email, password: userInfo.password + "1" });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Missing TOKEN_SECRET in login", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Make sure two access tokens are not the same", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.body.token).not.toEqual(userInfo.token);
    }));
    test("Get protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("Get protected API invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token + '1'
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);
    }));
    test("Get protected API fail missing TOKEN_SECRET ", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Invalid refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({ refreshToken: "invalidToken" });
        expect(response.statusCode).not.toBe(200);
    }));
    test("Refresh Token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;
    }));
    test("Refresh: Missing refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh");
        expect(response.statusCode).not.toBe(200);
    }));
    test("Missing TOKEN_SECRET in refresh", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/refresh").send({ refreshToken: userInfo.refreshToken });
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Missing TOKEN_SECRET in logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    }));
    test("Logout -invlaidate refreshToken", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/logout").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).not.toBe(200);
    }));
    test("Refresh token multiple usage", () => __awaiter(void 0, void 0, void 0, function* () {
        //login - get a refresh token
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;
        //first time use the refresh token and get a new one 
        const response2 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).toBe(200);
        const newRereshToken = response2.body.refreshToken;
        //second time use the old refresh token and expect to fail
        const response3 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).not.toBe(200);
        //try to use the new refresh token and expect to fail
        const response4 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: newRereshToken
        });
        expect(response4.statusCode).not.toBe(200);
    }));
    jest.setTimeout(30000);
    test("timeout access token", () => __awaiter(void 0, void 0, void 0, function* () {
        //login
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;
        //await 6 seconds
        yield new Promise((resolve) => setTimeout(resolve, 6000));
        //try to access with expired token
        const response2 = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: "invalid",
            title: "Test title",
            content: "Test content"
        });
        expect(response2.statusCode).not.toBe(201);
        const response3 = yield (0, supertest_1.default)(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).toBe(200);
        userInfo.token = response3.body.token;
        userInfo.refreshToken = response3.body.refreshToken;
        const response4 = yield (0, supertest_1.default)(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: "invalid",
            title: "Test title",
            content: "Test content"
        });
        expect(response4.statusCode).toBe(201);
    }));
});
//# sourceMappingURL=auth.test.js.map