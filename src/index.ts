import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import eventRoutes from './routes/eventRoutes';

const express = require("express");
dotenv.config();
const app = express();

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/events',eventRoutes);

app.listen(3000);