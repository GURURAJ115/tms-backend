import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
const express = require("express");
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);

app.listen(3000);