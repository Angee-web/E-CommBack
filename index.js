const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ObjectId = require("mongoose");
const cors = require('cors');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors({ origin: '*' })) //the host that the react app is running on

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://adaezeugwumba460:Dabu6039@cluster0.bqjorqm.mongodb.net/E-Commerce?retryWrites=true&w=majority&appName=E-Commerce"
);
const db = mongoose.connection;

// Check if the database connection is successful
db.once("open", () => {
    console.log("Database connected");
});

// Define the product schema
const productSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

// Create the product model with the correct collection name
const Products = mongoose.model("Products", productSchema, "Products");

// Route to test if the server is connected
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Connected to Backend" });
});

// Route to add a new product
app.post("/api/v1/addProduct", async (req, res) => {
    try {
        const product = new Products(req.body);
        await product.save(); // Save the product to the database
        res.status(201).send({
            status: "success",
            message: "Product Created Successfully"
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


// Route to get all products
app.get("/api/v1/getProducts", async (req, res) => {
    try {
        const products = await Products.find(); // Retrieve all products from the database
        res.status(200).json({
            msg: "Success",
            dataCount: products.length,
            data: products,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Route to update a product
app.patch("/api/v1/updateProduct/:productId", async (req, res) => {
    const id = req.params.productId;
    try {
        const updatedProduct = await Products.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if(!updatedProduct){
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }
        res.status(200).send({
            status: "success",
            message: "Product Updated Successfully",
            data: updatedProduct
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

app.delete("/api/v1/deleteProduct/:productId", async (req, res) => {
    const id = req.params.productId;
    try {
        const deletedProduct = await Products.findByIdAndDelete(id);

        if(!deletedProduct){
            return res.status(404).json({
                status: "error",
                message: "Product not found",
            });
        }
        res.status(200).send({
            status: "success",
            message: "Product Deleted Successfully",
            data: deletedProduct
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});



// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
