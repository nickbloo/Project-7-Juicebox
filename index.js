const express = require("express");
const app = express();
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {JWT_SECRET } = process.env;
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

// async function decryptJWT(req, res, next) {
//     try {
//         const authHeader= req.headers.authorization
//         if (!authHeader) {
//             res.error("Invalid token from headers")
//         } else {
//             const slicedToken = authHeader.slice(7);
//             const verifiedAuthData = jwt.verify(slicedToken, JWT_SECRET);

//             console.log("Verified auth data: ", verifiedAuthData)
//         }
//         next();
//     } catch (error) {
//         console.error
//     }
// };

// app.use(decryptJWT);

// app.get("/", (req, res, next) => {
//     res.send(`<h1>Hello World!</h1>`)
// });

// app.post("/register", (req, res, next) => {
//     try {
//         let newUserData = req.body;

//         const newToken = jwt.sign({
//             username: newUserData.username
//         }, JWT_SECRET, {
//             expiresIn: "1w"
//         })
//         res.end()
//     } catch (error) {
//         console.error
//     }
// })

const PORT = 3000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});