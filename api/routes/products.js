const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const productController = require("../controllers/products")
// const multer = require('multer');

// code to store images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads')
//   }, 
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + file.filename)
//   }
// })

// const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 } });

const Product = require("../models/product");

router.get("/", productController.get_All_Products);

router.post("/", checkAuth, productController.post_Product);

router.get("/:productId", checkAuth, productController.get_Product);

router.patch("/:productId", checkAuth, productController.patch_Product);

router.delete("/:productId", checkAuth, productController.delete_Product);

module.exports = router;
