import { Schema,model} from "mongoose";
import mongoose from "mongoose";
const models=mongoose.models;



const CommentSchema=new Schema(
    {
        Film: { type: mongoose.Schema.Types.ObjectId, ref: "films",required: true},
        User: { type: mongoose.Schema.Types.ObjectId, ref: "users",required: true},
        text:{type:"string",required:true},
    },
    {
        timestamps:true,
    }
)

const comments = models.comments|| model("comments",CommentSchema);

export default comments;