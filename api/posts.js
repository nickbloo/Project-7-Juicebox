const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost } = require("../db");
const { requireUser } = require("./utils");

postsRouter.use((req, res, next) => {
    console.log("Request made to /posts");
    next();
});

postsRouter.get("/", async (req, res) => {
    const posts = await getAllPosts();
    res.send({ posts });
});

postsRouter.post("/", requireUser, async (req, res, next) => {
    res.send({
        message: "Under Construction"
    });
});

module.exports = postsRouter;