
require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer"); 

const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("Frontend")); 

let products = [
    {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 100,
        image: "/uploads/skincare.jpg",
    },
    {
        id: 2,
        name: "Product 2",
        description: "Description of Product 2",
        price: 200,
        image: "/uploads/skin2.jpg",
    },
];
const storage = multer.diskStorage({
    destination: "./Frontend/uploads", 
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); 
    },
  });
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "Frontend/uploads")));


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
app.post("/api/products", upload.single("image"), (req, res) => {
    const { name, description, price } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; 

    // Save the product in your database (example product object)
    const product = { id: Date.now(), name, description, price, image: imageUrl };
  
    // Mock database operation (replace with real database logic)
    products.push(product);
  
    res.status(201).json({ message: "Product created successfully", product });
  });

// Update a product
app.put("/api/products/:id", upload.single("image"), (req, res) => {
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send("Product not found");

    const { name, description, price } = req.body;
    if (req.file) {
        product.image = `/uploads/${req.file.filename}`; // Update the image if a new one is uploaded
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    res.json({ message: "Product updated successfully", product });
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
            amount: amount, 
            currency: "usd",
            payment_method_types: ["card"],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  
// Route to upload product images
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
  
    const { productName } = req.body; // Assuming the form sends `productName`
    const imagePath = `/uploads/${req.file.filename}`; // File path for the uploaded image
  
    res.status(201).json({
      message: "Image uploaded successfully!",
      product: {
        name: productName,
        image: imagePath,
      },
    });
  });
  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
