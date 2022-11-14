const express = require("express");
const usersRouter = express.Router();
const { getAllUsers, getUserByUsername, client, createUser, getUserById, updateUser } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
require("dotenv").config();

usersRouter.use((req, res, next) => {
    console.log("Request made to /users");
    next();
});

usersRouter.get("/", async (req, res) => {
    try {
        const allUsers = await getAllUsers();
        const users = allUsers.filter(user => {
            return user.active || (req.user && user.id === req.user.id);
        })
        res.send({ users });
    } catch ({ name, message }) {
        next({ name, message });
    }
});

usersRouter.post("/register", async (req, res, next) => {
    const {username, password, name, location} = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: "Username Error",
                message: "A user by that username already exists"
            });
        }

        const user = await createUser({
            username,
            password,
            name,
            location,
        });

        const token = jwt.sign({
            id: user.id,
            username }, JWT_SECRET, {
                expiresIn: "1w"
        });

        res.send({
            message: "Thank you for signing up!",
            token: token
        });

    } catch ({name, message}) {
        next({name, message})
    }
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
        const token = jwt.sign({
                id: user.id,
                username }, JWT_SECRET, {
                    expiresIn: "1w"
            });

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

usersRouter.delete("/:userId", requireUser, async (req, res, next) => {
    try {
        const user = await getUserById(req.params.userId);

        if (user && user.id === req.user.id) {
            const deletedUser = await updateUser(user.id, {active: false});
            res.send({user: deletedUser});
        } else {
            next(user ? {
                name: "Unathorized User Error",
                message: "You cannot delete a user that is not you"
            } : {
                name: "User Not Found Error",
                message: "That user does not exist"
            });
        }
    } catch ({name, message}) {
        next({name, message});
    }
});

module.exports = usersRouter;