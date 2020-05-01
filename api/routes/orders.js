const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

const orderController = require("../controllers/orders")

router.get("/", checkAuth, orderController.get_All_Orders);

router.post("/", checkAuth, orderController.post_Order);

router.get("/:orderId", checkAuth, orderController.get_Single_Order);

router.delete("/:orderId", checkAuth, orderController.delete_Order);

module.exports = router;
