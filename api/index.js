const express = require("express");
const usersRouter = require("./users");
const postsRouter = require("./posts");
const tagsRouter = require("./tags");
const apiRouter = express.Router();

const { getUserById } = require("../db");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");

apiRouter.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if (!auth) {
        console.log("No token!")
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({name, message}) {
            next({name, message});
        }
    } else {
        next({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`
        });
    }
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;