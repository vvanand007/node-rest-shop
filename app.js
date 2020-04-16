const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRouter = require("./api/routes/products");
const orderRouter = require("./api/routes/orders");

mongoose
  .connect(
    "mongodb+srv://dbUser:" +
      process.env.MONGO_ATLAS_PW +
      "@aws-test0-vjrpx.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(db => console.log("database", db.connections[0].readyState));
mongoose.Promise = global.Promise;
// app.use((req, res, next) => {
//   res.status(200).json({ message: "It works" });
// });
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//below code is to prevent CORS(Cross-Origin Resource Sharing) error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
