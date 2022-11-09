const express = require("express");
const app = express();
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { client } = require("./db")

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiRouter = require("./api");
app.use("/api", apiRouter);


app.use((req, res, next) => {
    console.log("Request received!")
    console.log(req.body);
    next();
});

client.connect();

const PORT = 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});