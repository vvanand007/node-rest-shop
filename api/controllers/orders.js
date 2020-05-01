const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");

exports.get_All_Orders = (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

exports.post_Order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "product not found"
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "order stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/order"
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.get_Single_Order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                res.status(404).json({ message: "order doesn't exit" });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http:/localhost:3000/orders"
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

exports.delete_Order = (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { poductId: "ID", quantity: "Number" }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}