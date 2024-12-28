import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_models";
import { Express } from "express";  
import userModel from "../models/user_models";

let app:Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
    token:""
    
  }
  let postId="";

  const testPost={  
    title:"Test title",
    content:"First Test",
    owner:"Or",
};



beforeAll(async()=>{
   app= await initApp();
   console.log('beforeAll');
  await postModel.deleteMany();
  await userModel.deleteMany();        
  const response = await request(app).post("/auth/register").send(testUser);
  expect(response.statusCode).toBe(200);
  const response2 = await request(app).post("/auth/login").send(testUser);
  expect(response2.statusCode).toBe(200);
  testUser.token = response2.body.token;
  testPost.owner = response2.body._id;
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
});



const invalidPost={  
    content:"First Test"
};

describe("Posts test suite", ()=>{
    test("Post test get all post", async()=>{
        const response=await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test adding new post",async()=>{  
        const response=await request(app).post("/posts").set({
            authorization:"JWT " + testUser.token,
        }).send(testPost);
        expect(response.statusCode).toBe(201);  
         expect(response.body.owner).toBe(testPost.owner);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        postId=response.body._id;
    });

    test("Test adding invalid post",async()=>{  
        const response=await request(app).post("/posts").set({
            authorization: "JWT " + testUser.token,
          }).send(invalidPost);
        expect(response.statusCode).toBe(400);
    });


    test("Test get all posts after adding", async()=>{
        const response=await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Test get post by owner", async()=>{  
        const response=await request(app).get("/posts?owner=" + testPost.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testPost.owner);
    });

    test("Test get post by id", async()=>{
        const response=await request(app).get("/posts/"+ postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });
  
    test("Test get post by fail id-1", async()=>{
        const response=await request(app).get("/posts/"+ postId +5);
        expect(response.statusCode).toBe(400);
    });

    test("Test get post by fail id-2", async()=>{
        const response=await request(app).get("/posts/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    });

    test("Posts Delete test", async () => {
        const response = await request(app)
        .delete("/posts/"+ postId)
        .set({
            authorization: "JWT " + testUser.token});
        expect(response.statusCode).toBe(200);
    
        const respponse2 = await request(app).get("/posts/"+ postId);
        expect(respponse2.statusCode).toBe(404);
    
        const respponse3 = await request(app).get("/posts/"+ postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
      });
  
});

