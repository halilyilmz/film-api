import connect from "../config/db.js"
import films from "../models/Film.js";

export const addFilm=async (req,res)=>{
    try{
        await connect();

        const {name,description,genre,director,release_date}=req.body;

        if(!name ||!description ||!genre ||!director ||!release_date){
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }

        const film = new films({ name,description,genre,director,release_date });
        await film.save();

        return res.status(200).json({ message: "Film eklendi" });
    }
    catch (err){
        console.log("write_aa err: ",err)
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}

export const updateFilm=async (req,res)=>{
    try{
        await connect();

        const {id}=req.params;
        const {name,description,genre,director,release_date}=req.body;

        if(!id ||!name ||!description ||!genre ||!director ||!release_date){
            return res.status(400).json({ error: "Eksik bilgi girdiniz!" });
        }


        const updatedFilm=await films.findByIdAndUpdate(id, {name,description,genre,director,release_date}, {new: true}).lean();
        
            delete updatedFilm.__v;
            delete updatedFilm.updatedAt;
            delete updatedFilm.createdAt;

        if(!updatedFilm){
            return res.status(404).json({ error: "Film bulunamadı!" });
        }

        return res.status(200).json({ message: "Film güncellendi", updatedFilm });
    }
    catch (err){
        console.log("update_aa err: ",err)
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}

export const deleteFilm=async (req,res)=>{
    try{
        await connect();

        const {id}=req.params;

        if(!id){
            return res.status(400).json({ error: "silinecek filmin id'si gerekli!" });
        }

        const deletedFilm=await films.findByIdAndDelete(id);

        
        if(!deletedFilm){
            return res.status(404).json({ error: "Film bulunamadı!" });
        }
        return res.status(200).json({ message: "Film silindi", deletedFilm });
    }
    catch (err){
        console.log("delete_aa err: ",err)
        return res.status(500).json({ error: "Bir hata oluştu!" });
    }
}