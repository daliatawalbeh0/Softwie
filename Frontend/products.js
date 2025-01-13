document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("paymentModal");
    const closeModal = document.querySelector(".close-btn");
    const paymentForm = document.getElementById("payment-form");
    const productGallery = document.getElementById("productGallery");
  
    const stripe = Stripe("pk_test_51QgmRGE4HcguIW2e3jcOm895rNFSQkOdpmA0ZzqaBqdLmMnUyUeTaJpIRdxi3YUPWtEfP2QxKfo3r25WlYRpEAxO00g897HDfe"); // Replace with your publishable key
    const elements = stripe.elements();
    const card = elements.create("card");
    card.mount("#card-element");
  
    // Open modal on "Buy Now" button click
    const payForProduct = (amount) => {
      modal.style.display = "block";
      paymentForm.dataset.amount = amount; // Store the product price in the form
      paymentForm.reset();
      document.getElementById("card-errors").textContent = ""; // Clear previous errors
    };
  
    // Close the modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  
    // Fetch and display products
    const fetchProductGallery = () => {
      fetch("/api/products")
        .then((res) => res.json())
        .then((products) => {
          productGallery.innerHTML = ""; // Clear existing products
          products.forEach((product) => {
            const productDiv = document.createElement("div");
            productDiv.className = "product";
            productDiv.innerHTML = `
              <img src="${product.image}" alt="${product.name}" class="product-image">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <p>Price: $${(product.price / 100).toFixed(2)}</p>
              <button data-amount="${product.price}" class="pay-btn">Buy Now</button>
            `;
            productGallery.appendChild(productDiv);
          });
  
          // Attach event listeners to buttons
          const payButtons = document.querySelectorAll(".pay-btn");
          payButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const amount = button.getAttribute("data-amount");
              payForProduct(amount);
            });
          });
        })
        .catch((error) => console.error("Error fetching products:", error));
    };
  
    fetchProductGallery();
  
    // Handle payment form submission
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value;
      const name = document.getElementById("name-on-card").value;
      const country = document.getElementById("country").value;
      const postalCode = document.getElementById("postal-code").value;
      const amount = paymentForm.dataset.amount; // Retrieve the stored product price
  
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // Pass the amount to the backend
      })
        .then((res) => res.json())
        .then(({ clientSecret }) => {
          stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: card,
              billing_details: {
                name: name,
                email: email,
                address: {
                  country: country,
                  postal_code: postalCode,
                },
              },
            },
          }).then((result) => {
            if (result.error) {
              document.getElementById("card-errors").textContent = result.error.message;
            } else {
              alert("Payment successful!");
              modal.style.display = "none"; // Close the modal on success
            }
          });
        })
        .catch((error) => console.error("Error creating payment intent:", error));
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
  
    // Toggle the nav menu
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  });
  