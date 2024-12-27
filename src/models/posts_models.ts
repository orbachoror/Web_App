const mongoose=require("mongoose");

const postSchema =new mongoose.Schema({
    title: {
        type:String,
        require: true,
    },
    content:String,
    owner:{
        type: String,
        require:true,
    },
});

const postModel =mongoose.model("posts",postSchema);
module.exports=postModel;