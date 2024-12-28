import PostModel, { iPost } from "../models/posts_models";
import createController from "./base_controller";

const postsController = createController<iPost>(PostModel);


export default postsController;

