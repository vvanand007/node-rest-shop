const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('../models/user')

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1)
                res.status(422).json({ message: "user already exist" })
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err })
                    }
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({ message: "user created" });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({ error: err });
                        })
                })
            }
        })
})

router.post("/signin", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ message: "auth failed" })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ message: "Auth failed" });
                }
                if (result) {
                    const token = jwt.sign(
                        { email: user[0].email, userid: user[0]._id },
                        "mysecretkey",
                        { expiresIn: "1h" })
                    return res.status(200).json(
                        { message: "Auth Successfull", token: token }
                    )
                }
                return res.status(401).json({ message: "Password mismatch" })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: err });
        })
})

router.delete("/:id", (req, res, next) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({ message: "user deleted" });
        })
        .catch(err => {
            res.status(404).json({ error: err });
        })
})
module.exports = router;