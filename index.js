import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import 'dotenv/config';
//import statement ends
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION);


const productSchema = mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    rating: Number,
    description: String,
    category: String
});

const Product = mongoose.model("product", productSchema);

app.get("/products", async (req, res) => {
    try {
        const allProducts = await Product.find({}).exec();
        const formattedProducts = allProducts.map(product => {
            return {
                id: product.id,
                title: product.title,
                price: product.price,
                rating: product.rating,
                description: product.description,
                category: product.category
            };
        });
        res.json({ products: formattedProducts });
    } catch (err) {
        res.status(404).send(err.message);
    }
});
app.get("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id: id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const formattedProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            rating: product.rating,
            description: product.description,
            category: product.category
        };

        res.json({ product: formattedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/products", async (req, res) => {
    try {
        const newProduct = new Product({
            id: req.body.id,
            title: req.body.title,
            price: req.body.price,
            rating: req.body.rating,
            description: req.body.description,
            category: req.body.category
        });
        const finalProduct = await newProduct.save();

        const formattedProduct = {
            id: finalProduct.id,
            title: finalProduct.title,
            price: finalProduct.price,
            rating: finalProduct.rating,
            description: finalProduct.description,
            category: finalProduct.category
        };

        res.json({ product: formattedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id: id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.title = req.body.title;
        product.price = req.body.price;
        product.rating = req.body.rating;
        product.description = req.body.description;
        product.category = req.body.category;

        await product.save();

        const formattedProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            rating: product.rating,
            description: product.description,
            category: product.category
        };

        res.json({ product: formattedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.patch("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id: id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.title = req.body.title || product.title;
        product.price = req.body.price || product.price;
        product.rating = req.body.rating || product.rating;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;

        await product.save();

        const formattedProduct = {
            id: product.id,
            title: product.title,
            price: product.price,
            rating: product.rating,
            description: product.description,
            category: product.category
        };

        res.json({ product: formattedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete("/products/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findOne({ id: id });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await Product.deleteOne({ id: id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Server started on port " + port);
});
