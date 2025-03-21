import jwt from 'jsonwebtoken'; // jsonwebtoken modülünü import etmelisiniz
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    throw new Error("JWT KEY not defined");
}

export const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token bulunamadı!" });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        if (decoded) {
            if(decoded.role=="admin"){
                next()
            }
            else{
                return res.status(401).json({ error: "Yetkiniz yok!" });
            }
        } else {
            return res.status(401).json({ error: "Token doğrulaması başarısız!" });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Giriş yapılamadı!" });
    }
};


export const authUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Token bulunamadı!" });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        if (decoded) {
            next()
        } else {
            return res.status(401).json({ error: "Token doğrulaması başarısız!" });
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Giriş yapılamadı!" });
    }
};
