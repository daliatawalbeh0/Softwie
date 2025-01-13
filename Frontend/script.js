const fetchProducts = () => {
    fetch("/api/products")
        .then((res) => res.json())
        .then((products) => {
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            products.forEach((product) => {
                const div = document.createElement("div");
                div.className = "product";
                div.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <div class="product-actions">
                        <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
                        <button onclick="editProduct(${product.id})" class="edit-btn">Edit</button>
                    </div>
                `;
                gallery.appendChild(div);
            });
        });
};


fetchProducts();

// Add Product
document.querySelector("#productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").value;

    fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, image }),
    }).then(() => {
        fetchProducts();
        e.target.reset();
    });
});

// Delete Product with Confirmation Alert
const deleteProduct = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
        fetch(`/api/products/${id}`, { method: "DELETE" })
            .then(() => fetchProducts())
            .catch((error) => console.error("Error deleting product:", error));
    }
};

// Edit Product
let editingId = null;
const editProduct = (id) => {
    fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((product) => {
            editingId = id;
            document.getElementById("editProductName").value = product.name;
            document.getElementById("editProductDescription").value = product.description;
            document.getElementById("editProductPrice").value = product.price;
            document.querySelector(".edit-product").style.display = "block";
        });
};

document.querySelector("#editForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("editProductName").value;
    const description = document.getElementById("editProductDescription").value;
    const price = document.getElementById("editProductPrice").value;
    const image = document.getElementById("editProductImage").value;

    fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, image }),
    }).then(() => {
        fetchProducts();
        document.querySelector(".edit-product").style.display = "none";
    });
});

// Fetch and display products in the Products Page
if (document.getElementById("productGallery")) {
    fetch("/api/products")
        .then((res) => res.json())
        .then((products) => {
            const productGallery = document.getElementById("productGallery");
            productGallery.innerHTML = ""; // Clear existing products

            products.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image" 
                        onerror="this.onerror=null;this.src='https://via.placeholder.com/250';">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <button onclick="payForProduct(${product.price})" class="pay-btn">Buy Now</button>
                `;
                productGallery.appendChild(productDiv);
            });
        })
        .catch((error) => console.error("Error fetching products:", error));
}

const fetchProductGallery = () => {
    const productGallery = document.getElementById("productGallery");
    if (productGallery) {
        fetch("/api/products")
            .then((res) => res.json())
            .then((products) => {
                productGallery.innerHTML = ""; // Clear existing products
                products.forEach((product) => {
                    const productDiv = document.createElement("div");
                    productDiv.className = "product";
                    productDiv.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="product-image" 
                            onerror="this.onerror=null;this.src='https://via.placeholder.com/250';">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <button onclick="payForProduct(${product.price})" class="pay-btn">Buy Now</button>
                    `;
                    productGallery.appendChild(productDiv);
                });
            });
    }
};

// Stripe Payment
const payForProduct = (amount) => {
    fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100, currency: "usd" }), // Stripe expects amount in cents
    })
        .then((res) => res.json())
        .then(({ clientSecret }) => {
            alert(`Payment initiated for $${amount}. Please complete the payment.`);
        })
        .catch((error) => console.error("Payment error:", error));
};

fetchProductGallery();