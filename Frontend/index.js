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
                    <h2>ID: ${product.id}</h2>
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
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
// Add Product// Add Product with Image Upload
document.querySelector("#productForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target); // Automatically includes all form inputs
  
    const response = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    alert(data.message);
  
    // Add the new product to the gallery
    const gallery = document.querySelector(".gallery");
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
      <img src="${data.product.image}" alt="${data.product.name}" class="product-image">
      <h2>ID: ${data.product.id}</h2>
      <h2>${data.product.name}</h2>
      <p>${data.product.description}</p>
      <p>Price: $${data.product.price}</p>
      <div class="product-actions">
        <button onclick="deleteProduct(${data.product.id})" class="delete-btn">Delete</button>
        <button onclick="editProduct(${data.product.id})" class="edit-btn">Edit</button>
      </div>
    `;
    gallery.appendChild(productDiv);
  
    // Reset the form
    e.target.reset();
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




const uploadForm = document.getElementById("productForm");
  const productGallery = document.getElementById("productGallery");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    alert(data.message);

    // Display the uploaded product
    const productDiv = document.createElement("div");
    productDiv.innerHTML = `
      <h3>${data.product.name}</h3>
      <img src="${data.product.image}" alt="${data.product.name}" width="200" />
    `;
    productGallery.appendChild(productDiv);
  });


