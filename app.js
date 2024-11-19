const express = require('express');
const app = express();
const dotenv= require("dotenv").config();
const port = process.env.PORT;

const mongoose =require("mongoose");
mongoose.connect(process.env.DB_CONNECT);

const db= mongoose.connection;
db.on("error",(error)=>{console.error(error)});
db.once("open",()=>console.log("Connected to Mongoose"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});