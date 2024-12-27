import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/posts_routes';
import comments from './routes/comments_routes';

const app = express();

dotenv.config();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on("error", (error) => { console.error(error) });
db.once("open", () => console.log("Connected to Mongoose"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", postRoutes);
app.use("/comments", comments);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
