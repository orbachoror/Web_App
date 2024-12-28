import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_models";
import postModel from "../models/posts_models";
let app: Express;

beforeAll(async () => {
    app = await initApp();
    await userModel.deleteMany({});
    await postModel.deleteMany({});
    console.log('beforeAll');
});

afterAll(async () => {
    console.log('afterAll');
    await mongoose.connection.close();
});

type UserInfo = {
    email: string,
    password: string,
    token?: string,
    refreshToken?: string,
    _id?: string
};

const userInfo: UserInfo = {
    email: "orbachor@gmail.com",
    password: "123"
};
const invalidUserInfo: UserInfo = {
    email: "orbachor@gmail.com",
    password: ""
};

describe("Auth tests", () => {
    test("Auth Registration", async () => {
        const response = await request(app).post("/auth/register").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
    });
    test("Auth Registration fail without password", async () => {
        const response = await request(app).post("/auth/register").send(invalidUserInfo);
        expect(response.statusCode).not.toBe(200);
    });

    test("Auth Registration fail with exists email", async () => {
        const response = await request(app).post("/auth/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
    });
    test("Missing refresh token in logout", async () => {
        const response = await request(app).post("/auth/logout").send({});
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Refresh token is required");
    });
    jest.spyOn(userModel, "findOne").mockImplementationOnce(() => {
        throw new Error("Database error");
    });

    test("Login handles database error", async () => {
        const response = await request(app).post("/auth/login").send(userInfo);

        // Assert the response
        expect(response.statusCode).not.toBe(200); // Check that the error is caught and a 400 response is returned
    });
    test("Auth Login", async () => {

        const response = await request(app).post("/auth/login").send(userInfo);
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
    });

    test("Auth Login fail without password", async () => {
        const response = await request(app).post("/auth/login").send(invalidUserInfo);
        expect(response.statusCode).not.toBe(200);
    });
    test("Auth Login fail with correct password and false email", async () => {
        const response = await request(app).post("/auth/login").send({ email: userInfo.email + "1", password: userInfo.password });
        expect(response.statusCode).not.toBe(200);
    });
    test("Auth Login fail with correct email and false password", async () => {
        const response = await request(app).post("/auth/login").send({ email: userInfo.email, password: userInfo.password + "1" });
        expect(response.statusCode).not.toBe(200);
    });
    test("Missing TOKEN_SECRET in login", async () => {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = await request(app).post("/auth/login").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    });


    test("Make sure two access tokens are not the same", async () => {
        const response = await request(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.body.token).not.toEqual(userInfo.token);
    });

    test("Get protected API", async () => {
        const response = await request(app).post("/posts").send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response2.statusCode).toBe(201);
    });

    test("Get protected API invalid token", async () => {
        const response = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token + '1'
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);
    });
    test("Get protected API fail missing TOKEN_SECRET ", async () => {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: userInfo._id,
            title: "Test title",
            content: "Test content"
        });
        expect(response.statusCode).not.toBe(201);
        process.env.TOKEN_SECRET = originalSecret;
    });
    test("Invalid refresh token", async () => {
        const response = await request(app).post("/auth/refresh").send({ refreshToken: "invalidToken" });
        expect(response.statusCode).not.toBe(200);
    });
    test("Refresh Token", async () => {
        const response = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;
    });
    test("Refresh: Missing refresh token", async () => {
        const response = await request(app).post("/auth/refresh");
        expect(response.statusCode).not.toBe(200);
    });
    test("Missing TOKEN_SECRET in refresh", async () => {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = await request(app).post("/auth/refresh").send({ refreshToken: userInfo.refreshToken });
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    });
    test("Missing TOKEN_SECRET in logout", async () => {
        const originalSecret = process.env.TOKEN_SECRET;
        delete process.env.TOKEN_SECRET;
        const response = await request(app).post("/auth/logout").send(userInfo);
        expect(response.statusCode).not.toBe(200);
        process.env.TOKEN_SECRET = originalSecret;
    });
    test("Logout -invlaidate refreshToken", async () => {
        const response = await request(app).post("/auth/logout").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).not.toBe(200);
    });

    test("Refresh token multiple usage", async () => {
        //login - get a refresh token
        const response = await request(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;

        //first time use the refresh token and get a new one 
        const response2 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response2.statusCode).toBe(200);
        const newRereshToken = response2.body.refreshToken;

        //second time use the old refresh token and expect to fail
        const response3 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).not.toBe(200);

        //try to use the new refresh token and expect to fail
        const response4 = await request(app).post("/auth/refresh").send({
            refreshToken: newRereshToken
        });
        expect(response4.statusCode).not.toBe(200);
    });

    jest.setTimeout(30000);
    test("timeout access token", async () => {
        //login
        const response = await request(app).post("/auth/login").send({
            email: userInfo.email,
            password: userInfo.password
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.token = response.body.token;
        userInfo.refreshToken = response.body.refreshToken;

        //await 6 seconds
        await new Promise((resolve) => setTimeout(resolve, 6000));

        //try to access with expired token
        const response2 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: "invalid",
            title: "Test title",
            content: "Test content"
        });
        expect(response2.statusCode).not.toBe(201);


        const response3 = await request(app).post("/auth/refresh").send({
            refreshToken: userInfo.refreshToken
        });
        expect(response3.statusCode).toBe(200);
        userInfo.token = response3.body.token;
        userInfo.refreshToken = response3.body.refreshToken;

        const response4 = await request(app).post("/posts").set({
            authorization: 'jwt ' + userInfo.token
        }).send({
            owner: "invalid",
            title: "Test title",
            content: "Test content"
        });
        expect(response4.statusCode).toBe(201);
    });



});