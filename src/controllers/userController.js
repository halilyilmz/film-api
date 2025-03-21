import connect from "../config/db.js";
import films from "../models/Film.js";
import users from "../models/User.js";
import bcrypt from "bcrypt";
import comments from "../models/Comment.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
if(JWT_SECRET_KEY==null){
    throw new Error("JWT_SECRET_KEY not defined")
}

export const getfilms=async (req,res)=>{
    try{
        await connect();

        const getedfilms =await films.find().lean();
        getedfilms.forEach((film)=>{
            delete film.__v;
            delete film.updatedAt;
            delete film.createdAt;
        })

        return res.status(200).json({ ok: true,films:getedfilms });
    }
    catch (err){
        console.log("getting films err: ",err)
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}

export const setFilmAsWatched = async (req, res)=>{
    try {
        await connect();

        const { userId,filmId } = req.params;


        const user=await users.findById(userId);
        const film=await films.findById(filmId).lean();
            delete film.__v;
            delete film.updatedAt;
            delete film.createdAt;

        user.watchedFilms.push(film);
        await user.save();
        return res.status(200).json({ message: "Film başarıyla izlenenler listesine eklendi" });

    }
    catch (err) {
        console.log("connect err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}

export const addComment=async (req,res)=>{
    try{
        await connect();
        const  {userId}=req.params;
        const { filmId,commentText } = req.body;

        if(!userId ||!filmId ||!commentText){
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const user=await users.findById(userId);
        const film=await films.findById(filmId);

        if(!user ||!film){
            return res.status(404).json({ error: "Kullanıcı veya film bulunamadı!" });
        }

        const comment=new comments({Film:filmId,User:userId,text:commentText})

        await comment.save();

        user.comments.push(comment);
        film.comments.push(comment);
        await user.save() ;
        await film.save();

        return res.status(200).json({message:"comment aded"})


    }
    catch (err){
        console.log("add_comment err: ",err)
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}
export const getComments = async (req, res) => {
    try {
        await connect();
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
        }

        const commentIds = user.comments;

        // Asenkron işlemleri beklemek için map ve Promise.all kullanıyoruz
        const commentTexts = await Promise.all(
            commentIds.map(async (commentId) => {
                const comment = await comments.findById(commentId);
                return comment?.text;
            })
        );

        return res.status(200).json({ comments: commentTexts });
    } catch (err) {
        console.error("get_comments err: ", err);
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
};
