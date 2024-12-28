import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_models";
import { Express } from "express";  

let app:Express;
beforeAll(async()=>{
   app= await initApp();
   console.log('beforeAll');
    await commentsModel.deleteMany();    
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
});

let commentId:string;
const testComment1={  
    comment:"First Test comment1",
    owner: "Or",
    postId: "1"
};

const testCommentFail={  
    comment:"InvalidTest title",
};

describe("Comments test suite", ()=>{
    
    test("Comments test get all Comments", async()=>{
        const response=await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test adding new comments",async()=>{ 
        const response=await request(app).post("/comments").send(testComment1);
        expect(response.statusCode).toBe(201);  
        expect(response.body.comment).toBe(testComment1.comment);
        expect(response.body.owner).toBe(testComment1.owner);
        commentId=response.body._id;
    });

    test("Test adding invalid comment",async()=>{  
        const response=await request(app).post("/comments").send(testCommentFail);
        expect(response.statusCode).toBe(400);
    });

    test("Test get all comment after adding", async()=>{
        const response=await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Test get comment by owner", async()=>{  
        const response=await request(app).get("/comments?owner=" + testComment1.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].owner).toBe(testComment1.owner);
    });

    test("Test get comment by id", async()=>{
        const response=await request(app).get("/comments/"+ commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    });
  
    test("Test get comment by id", async()=>{
        const response=await request(app).get("/comments/"+ commentId +5);
        expect(response.statusCode).toBe(400);
    });

    test("Test get comment by fail id", async()=>{
        const response=await request(app).get("/comments/6745df242f1b06026b3201f8");
        expect(response.statusCode).toBe(404);
    });
  
});

