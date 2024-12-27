import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/posts_routes';
import comments from './routes/comments_routes';

const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/posts", postRoutes);
app.use("/comments", comments);

const initApp = async (): Promise<Express> => {
    try {
        const mongoURL = process.env.MONGO_URL;
        if (!mongoURL) {
            throw new Error("Mongo URL is not defined in ENV file");
        }

        const db = mongoose.connection;
        db.on("error", (error) => { console.error(error) });
        db.once("open", () => console.log("Connected to Mongoose"));

        await mongoose.connect(mongoURL);

        return app;
    } catch (err) {
        console.error("Failed to initialize the app:", err);
        throw err;
    }
}

export default initApp;