const mongoose=require("mongoose");

const commentsSchema =new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts', // Reference to the Post model
        required: true
      },
      content: {
        type: String,
        required: true
      },
      author: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const commentsModel =mongoose.model("comments",commentsSchema);
module.exports=commentsModel;