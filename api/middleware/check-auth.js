const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, "mysecretkey");
        req.userData = decoded
        next();
    } catch (err) {
        res.status(401).json({ message: "Auth Failed" })
    }
}