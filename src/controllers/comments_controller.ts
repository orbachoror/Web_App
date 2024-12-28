import commentModel, { iComment } from "../models/comments_models";


import createController from "./base_controller";

const commentsController = createController<iComment>(commentModel);


export default commentsController;