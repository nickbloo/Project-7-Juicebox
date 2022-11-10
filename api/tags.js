const express = require("express");
const tagsRouter = express.Router();
const { getAllTags } = require("../db");
const { requireUser } = require("./utils");

tagsRouter.use((req, res, next) => {
    console.log("Request made to /tags");
    next();
});

tagsRouter.get("/", async (req, res) => {
    const tags = await getAllTags();
    res.send({ tags });
});

module.exports = tagsRouter;