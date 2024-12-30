import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_models";
import { Express } from "express";
import userModel from "../models/user_models";

let app: Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
    token: "",
    id:""
}

const testUser2 = {
    email: "test@user777.com",
    password: "123456",
    token: "",
    id:""
}

let postId = "";

const testPost = {
    title: "Test title",
    content: "First Test",
    owner: "Or",
};



beforeAll(async () => {
    app = await initApp();
    console.log('beforeAll');
    await postModel.deleteMany();
    await userModel.deleteMany();
    const response = await request(app).post("/auth/register").send(testUser);
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).post("/auth/login").send(testUser);
    expect(response2.statusCode).toBe(200);
    testUser.token = response2.body.token;
    //testPost.owner = response2.body._id;
    testUser.id = response2.body._id;
});

afterAll(async () => {
    console.log('afterAll');
    await mongoose.connection.close();
});



const invalidPost = {
    content: "First Test"
};

describe("Posts test suite", () => {
    test("Post test get all post", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test adding new post", async () => {
        const response = await request(app).post("/posts").set({
            authorization: "JWT " + testUser.token,
        }).send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(testUser.id);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        postId = response.body._id;
        testPost.owner = response.body.owner;
    });

    test("Test adding invalid post", async () => {
        const response = await request(app).post("/posts").set({
            authorization: "JWT " + testUser.token,
        }).send(invalidPost);
        expect(response.statusCode).toBe(400);
    });


    test("Test get all posts after adding", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Test get post by owner", async () => {
        const response = await request(app).get("/posts?owner=" + testPost.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testPost.owner);
    });

    test("Test get post by id", async () => {
        const response = await request(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });

    test("Test get post by fail id-1", async () => {
        const response = await request(app).get("/posts/" + postId + 5);
        expect(response.statusCode).toBe(400);
    });

    test("Test get post by fail id-2", async () => {
        const response = await request(app).get("/posts/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    });

    test("Update post test by id", async () => {
        const updatePst = {
            title: "Updated title",
            content: "Updated content",
        };

        const response = await request(app)
            .put("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser.token
            })
            .send(updatePst);

        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(updatePst.content);
        expect(response.body.title).toBe(updatePst.title);
    });

    test("Update post test by diffrent id ", async () => {
        const updatePost = {
            title: "Updated title",
            content: "Updated content",
        };

        const response1 = await request(app).post("/auth/register").send(testUser2);
        expect(response1.statusCode).toBe(200);
        const response2 = await request(app).post("/auth/login").send(testUser2);
        expect(response2.statusCode).toBe(200);
        testUser2.token = response2.body.token;
        testUser2.id = response2.body._id;

            const response = await request(app)
            .put("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser2.token
            })
            .send(updatePost);

        expect(response.statusCode).not.toBe(200);
    });


    test("Update post with wrong ID format", async () => {
        const updatePst = {
            title: "Updated title",
            content: "Updated content",
        };

        const response = await request(app)
            .put("/posts/" + postId + 5)
            .set({
                authorization: "JWT " + testUser.token
            })
            .send(updatePst);

        expect(response.statusCode).not.toBe(200);
    });


    test("Posts Delete test", async () => {
        const response = await request(app)
            .delete("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser.token
            });
        expect(response.statusCode).toBe(200);

        const respponse2 = await request(app).get("/posts/" + postId);
        expect(respponse2.statusCode).toBe(404);

        const respponse3 = await request(app).get("/posts/" + postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
    });

    test("Posts Delete test with other id", async () => {
        const response = await request(app)
            .delete("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser2.token
            });
        expect(response.statusCode).not.toBe(200);

        const respponse2 = await request(app).get("/posts/" + postId);
        expect(respponse2.statusCode).toBe(404);

        const respponse3 = await request(app).get("/posts/" + postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
    });


    test("Posts delete not existent post", async () => {
        const response = await request(app)
            .delete("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser.token
            });
        expect(response.statusCode).not.toBe(200);
    });

    test("Posts delete with wrong ID format", async () => {
        const response = await request(app)
            .delete("/posts/" + postId + 5)
            .set({
                authorization: "JWT " + testUser.token
            });
        expect(response.statusCode).not.toBe(200);
    });

    test("Update not existent post test", async () => {
        const updatePst = {
            title: "Updated title",
            content: "Updated content",
        };

        const response = await request(app)
            .put("/posts/" + postId)
            .set({
                authorization: "JWT " + testUser.token
            })
            .send(updatePst);

        expect(response.statusCode).not.toBe(200);
    });
});

