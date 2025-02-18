require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:4200",
        methods: ["GET", "POST" , "DELETE" , "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

mongoose
    .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("Error while connecting to DB", err));

const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server running at http://localhost:3000");
});
