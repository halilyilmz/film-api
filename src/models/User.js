import { Schema,model} from "mongoose";
import mongoose from "mongoose";
const models=mongoose.models;



const UserSchema=new Schema(
    {
        name:{type:"string",required:true},
        password:{type:"string",required:true},
        role:{type:"string",required:true},
        watchedFilms:[{ type: mongoose.Schema.Types.ObjectId, ref: "films"}],
        comments:[{ type: mongoose.Schema.Types.ObjectId, ref: "comments"}]
    },
    {
        timestamps:true,
    }
)


const users = models.users|| model("users",UserSchema);

export default users;