import express from 'express';
import { addFilm,updateFilm,deleteFilm } from '../controllers/adminController.js';
import { authAdmin } from '../middlewares/authMiddleware.js';
const adminRoutes = express.Router();


adminRoutes.post('/films',authAdmin,addFilm);
adminRoutes.put('/films/:id',authAdmin,updateFilm);
adminRoutes.delete('/films/:id',authAdmin,deleteFilm);



export default adminRoutes;