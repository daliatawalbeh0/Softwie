
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


const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
