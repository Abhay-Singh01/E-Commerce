/* ================= GLOBAL STATE ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    generateProducts();
    displayProducts(products);
    updateCartUI();
    setupEvents();
});

/* ================= PRODUCT DATA ================= */

function generateProducts() {

    products = []; // reset

    const data = [
        {
            key: "laptop",
            name: "Laptop",
            base: 50000,
            images: [
                "images/laptop.jpg",
                "images/laptop1.jpg"
            ]
        },
        {
            key: "phone",
            name: "Phone",
            base: 20000,
            images: [
                "images/phones.jpg"
            ]
        },
        {
            key: "wearable",
            name: "Watch",
            base: 6000,
            images: [
                "images/watches.jpg"
            ]
        },
        {
            key: "speaker",
            name: "Speaker",
            base: 4000,
            images: [
                "images/speakers.jpg"
            ]
        }
    ];

    data.forEach(category => {

        for (let i = 1; i <= 6; i++) {

            products.push({
                id: `${category.key}${i}`,
                category: category.key,
                name: `${category.name} ${i}`,
                price: category.base + i * 1500,
                image: category.images[i % category.images.length]
            });

        }

    });
}

/* ================= DISPLAY PRODUCTS ================= */

function displayProducts(list) {

    const container = document.getElementById("product-list");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No products found</p>";
        return;
    }

    list.forEach(product => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <h4>₹ ${product.price.toLocaleString()}</h4>
            <button data-id="${product.id}">Add to Cart</button>
        `;

        container.appendChild(card);
    });
}

/* ================= CATEGORY FILTER ================= */

function filterCategory(category) {

    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);

    document.getElementById("products")
        .scrollIntoView({ behavior: "smooth" });
}

/* ================= SEARCH ================= */

function searchProducts(value) {

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
    );

    displayProducts(filtered);
}

/* ================= CART SYSTEM ================= */

function addToCart(id) {

    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast("Added to Cart");
}

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateCartUI() {

    const cartItems = document.getElementById("cart-items");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cart-count");

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} (x${item.quantity})
            <button data-remove="${item.id}">❌</button>
        `;

        cartItems.appendChild(li);
    });

    totalEl.textContent = total.toLocaleString();
    countEl.textContent = count;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* ================= TOAST ================= */

function showToast(message) {

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);
    setTimeout(() => toast.remove(), 2000);
}

/* ================= CART TOGGLE ================= */

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}

/* ================= EVENTS ================= */

function setupEvents() {

    /* Search */
    document.getElementById("search")
        .addEventListener("keyup", (e) => {
            searchProducts(e.target.value);
        });

    /* Click Handling */
    document.addEventListener("click", (e) => {

        if (e.target.matches(".card button")) {
            addToCart(e.target.dataset.id);
        }

        if (e.target.matches("[data-remove]")) {
            removeFromCart(e.target.dataset.remove);
        }

        const categoryCard = e.target.closest(".category-card");
        if (categoryCard) {
            filterCategory(categoryCard.dataset.category);
        }

    });

    /* Close Cart When Clicking Outside */
    document.addEventListener("click", (e) => {

        const cartPanel = document.getElementById("cart");
        const cartBtn = document.querySelector(".cart-btn");

        if (
            cartPanel.classList.contains("active") &&
            !cartPanel.contains(e.target) &&
            !cartBtn.contains(e.target)
        ) {
            cartPanel.classList.remove("active");
        }

    });
}
