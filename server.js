import express from "express"
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

//import userRoutes from ;

const app=express();
dotenv.config();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);




const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});