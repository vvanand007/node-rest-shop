const mongoose = require("mongoose");
const Product = require("../models/product")

exports.get_All_Products = (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.post_Product = (req, res, next) => {
    // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            const response = {
                message: "Created Product Successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            };
            res.status(201).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.get_Product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                const response = {
                    product: doc,
                    request: {
                        type: "GET",
                        description: "GET_ALL_PRODUCTS",
                        url: "http://localhost:3000/products"
                    }
                };
                res.status(200).json(response);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.patch_Product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            const response = {
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ error: err });
        });
}

exports.delete_Product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            const response = {
                message: "Product Deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: { name: "String", price: "Number" }
                }
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}