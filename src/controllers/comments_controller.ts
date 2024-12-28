import commentsModel,{iComment} from "../models/comments_models";
import createController from "./base_controller";

const commentsController = createController<iComment>(commentsModel);

export default commentsController
