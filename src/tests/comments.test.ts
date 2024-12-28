import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comments_models";
import { Express } from "express";  
import userModel from "../models/user_models";

let app:Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
    token:""
    
  }
  let postId="";

  const testComment={  
    comment:"Test comment",
    postId:"First Test",
    owner:"Or",
};



beforeAll(async()=>{
   app= await initApp();
   console.log('beforeAll');
  await commentModel.deleteMany();
  await userModel.deleteMany();        
  const response = await request(app).post("/auth/register").send(testUser);
  expect(response.statusCode).toBe(200);
  const response2 = await request(app).post("/auth/login").send(testUser);
  expect(response2.statusCode).toBe(200);
  testUser.token = response2.body.token;
  testComment.owner = response2.body._id;
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
});



const invalidComment={  
    comment:"First Test"
};

describe("Comments test suite", ()=>{
    test("Comment test get all Comments", async()=>{
        const response=await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test adding new comments",async()=>{  
        const response=await request(app).post("/comments").set({
            authorization:"JWT " + testUser.token,
        }).send(testComment);
        expect(response.statusCode).toBe(201);  
         expect(response.body.owner).toBe(testComment.owner);
        expect(response.body.comment).toBe(testComment.comment);
        postId=response.body._id;
    });

    test("Test adding invalid comments",async()=>{  
        const response=await request(app).post("/comments").set({
            authorization: "JWT " + testUser.token,
          }).send(invalidComment);
        expect(response.statusCode).toBe(400);
    });


    test("Test get all comments after adding", async()=>{
        const response=await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Test get comments by owner", async()=>{  
        const response=await request(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testComment.owner);
    });

    test("Test get comments by id", async()=>{
        const response=await request(app).get("/comments/"+ postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    });
  
    test("Test get comments by fail id-1", async()=>{
        const response=await request(app).get("/comments/"+ postId +5);
        expect(response.statusCode).toBe(400);
    });

    test("Test get comments by fail id-2", async()=>{
        const response=await request(app).get("/comments/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    });

    test("Comments Delete test", async () => {
        const response = await request(app)
        .delete("/comments/"+ postId)
        .set({
            authorization: "JWT " + testUser.token});
        expect(response.statusCode).toBe(200);
    
        const respponse2 = await request(app).get("/comments/"+ postId);
        expect(respponse2.statusCode).toBe(404);
    
        const respponse3 = await request(app).get("/comments/"+ postId);
        const post = respponse3.body;
        console.log(post);
        expect(respponse3.statusCode).toBe(404);
      });

      test("Update comments test by id", async () => {
        const updateComments = {
            comment: "Updated comment",
        };

        const response= await request(app)
        .put("/comments/"+ postId)
        .set({
            authorization: "JWT " + testUser.token})
        .send(updateComments);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.comment).toBe(updateComments.comment);
      });
  
});

