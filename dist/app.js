const express = require('express');
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on("error", (error) => { console.error(error); });
db.once("open", () => console.log("Connected to Mongoose"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const postRoutes = require("./routes/posts_routes");
app.use("/posts", postRoutes);
const comments = require("./routes/comments_routes");
app.use("/comments", comments);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map