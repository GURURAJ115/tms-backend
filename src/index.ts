import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
const express = require("express");
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

app.listen(3000);