function requireUser(req, res, next) {
    if (!req.user) {
        next({
            name: "Missing User Error",
            message: "You must be logged in to perform this action"
        });
    }
    next();
};

module.exports = { requireUser }