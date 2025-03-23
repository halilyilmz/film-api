import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const MONGODB_URI=process.env.MONGODB_URI

if(!MONGODB_URI){
    throw new Error("mongodb uri not defined")
}




const connect =async()=>{
    const connectionsSate=mongoose.connection.readyState;

    if(connectionsSate===1){
        console.log("allready connected")
        return;
    }

    if(connectionsSate===2){
        console.log("conecting...")
        return;
    }

    try{
        await mongoose.connect(MONGODB_URI,{
            dbName:"film-api",
            serverSelectionTimeoutMS: 5000,
        });
        console.log("connected");
    }
    catch (err){
        console.log("connectin err: ",err)
        throw new Error("error: ",err);

    }
};

export default connect;