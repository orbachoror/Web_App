import PostModel,{iPost} from "../models/posts_models";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";

 class PostsController extends BaseController<iPost>{
   constructor() {
     super(PostModel);
   }
     async createItem(req:Request, res:Response){
         const _id = req.query.userId;
         const post={
             ...req.body,
             owner:_id
         }
         req.body = post;
         super.createItem(req,res);
     }

 } 

export default new PostsController();

