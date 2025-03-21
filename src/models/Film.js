import { Schema,model} from "mongoose";
import mongoose from "mongoose";
const models=mongoose.models;



const FilmSchema=new Schema(
    {
        name:{type:"string",required:true},
        description:{type :"string",required: true},
        genre:{type :"string",required: true},
        director:{type :"string",required: true},
        release_date:{type :"string",required: true},
        comments:[{ type: mongoose.Schema.Types.ObjectId, ref: "comments"}]
    },
    {
        timestamps:true,
    }
)

const films = models.films|| model("films",FilmSchema);

export default films;