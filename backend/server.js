import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// get productData
import productData from "./data.js";
import config from "./config.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";


mongoose
    .connect(config.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then( () => console.log("Connected to mongodb."))
    .catch(error => console.log(error.reason));

// create backend API's to serve requests
// set responses and serve data upon browser's request

const app = express();
// enable cors on all routes
app.use(cors());
//add parser to read the body of the message in JSON format
app.use(express.json());
//implement account routers
app.use("/api/users", userRouter);
//implement order router
app.use("/api/orders", orderRouter);
app.get("/api/paypal/clientId", (req, res) => {
    res.send({ clientId: config.PAYPAL_CLIENT_ID });
})
app.get("/api/products", (req, res) => {
    res.send(productData.products);
});
app.get("/api/products/:id", (req , res) => {
    // match specific product details by its _id
    const product = productData.products.find( item => item._id === req.params.id);
    if (product) {
        res.send(product);
    } else {
        // send a custom error message
        res.status(404).send({message: "Product Does Not Exist!" });
    }
});
//add error handler for all express instances and send corresponding error message
app.use((err, req, res, next) => {
    const status = err.name && err.name === "ValidationError" ? 400: 500;
    res.status(status).send({ message: err.message });
})
app.listen(5000, () => {
    console.log("serve at http://localhost:5000");
});