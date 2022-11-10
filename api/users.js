const express = require("express");
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, client } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
    console.log("Request made to /users");
    next();
});

usersRouter.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.send({ users });
});

usersRouter.post("/login", async(req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        next({
            name: "Login Error",
            message: "Please input a valid username and password"
        })
    }

    try {
        const user = await getUserByUsername(username);
        const token = jwt.sign({ username, password }, JWT_SECRET);
        console.log(token);

        if (user && user.password === password) {
            res.send({
                message: "Logged in!",
                token: token
            })
        } else {
            next({
                name: "Incorrect Login",
                message: "Username or password is incorrect"
            });
        }
    } catch (error) {
        console.error
        next(error);
    }
});

module.exports = usersRouter;