import express from 'express';
import authRoutes from "./src/routes/authRoutes";
import requestRoutes from "./src/routes/friendRoutes";
import locationRoutes from "./src/routes/locationRoutes";
import QueryRoutes from "./src/routes/queryRoutes";
import postRoutes from './src/routes/postRoutes';
import MessageRoutes from './src/routes/messageRoutes';
import NotificationRoutes from './src/routes/NotificationRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT  || 8001;

app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/request',requestRoutes);
app.use('/api/location',locationRoutes);
app.use('/api/query',QueryRoutes);
app.use('/api/message',MessageRoutes);
app.use('/api/notification',NotificationRoutes)

app.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`);
})
