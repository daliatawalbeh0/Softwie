
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("Frontend")); // Serve static files from the Frontend folder

// In-memory product storage
let products = [
    {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 100,
        image: "https://via.placeholder.com/250",
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description of Product 2",
        price: 200,
        image: "https://via.placeholder.com/250",
    },
];

// Routes

// Serve the front-end for the root route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Frontend/index.html");
});

// Get all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// Get a product by ID
app.get("/api/products/:id", (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
});

// Add a new product
app.post("/api/products", (req, res) => {
    const { name, description, price, image } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        description,
        price,
        image: image || "https://via.placeholder.com/250",
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Update a product
app.put("/api/products/:id", (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send("Product not found");

    const { name, description, price, image } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;

    res.json(product);
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
    const productIndex = products.findIndex((p) => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send("Product not found");

    products.splice(productIndex, 1);
    res.status(204).send();
});

// Stripe Payment API

app.post("/api/create-payment-intent", async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
