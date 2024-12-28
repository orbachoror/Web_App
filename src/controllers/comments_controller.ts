import commentModel,{iComment} from "../models/comments_models";

import { BaseController } from "./base_controller";
import { Request, Response } from "express";

class commentsController extends BaseController<iComment>{
    constructor() {
      super(commentModel);
    }
      async createItem(req:Request, res:Response){
          const _id = req.query.userId;
          const comment={
              ...req.body,
              owner:_id
          }
          req.body = comment;
          super.createItem(req,res);
      }
 
  } 
export default new commentsController();
