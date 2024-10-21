
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { restrictToLoggedinUserOnly } from './middlewares/auth';
import connectToMongoDB from './connect'; 
import userRoute from './routes/user';
import urlRoute from './routes/router';

dotenv.config(); 

const app = express();

const PORT: number = Number(process.env.PORT) || 5050;

// Connect to MongoDB
connectToMongoDB(process.env.MONGO_URL!)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRoute);
app.use('/', restrictToLoggedinUserOnly , urlRoute);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
