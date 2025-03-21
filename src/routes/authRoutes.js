import express from 'express';
import {login,addUser} from "../controllers/authController.js"
const authRoutes = express.Router();

//authRoutes.post('/register',signUser);
//authRoutes.post('/login',lsogUser);
authRoutes.post('/login',login);
authRoutes.post("/addUser",addUser);


export default authRoutes;