/*const products = [
    {
        name: "Wireless Headphones",
        image: "https://www.headphonezone.in/cdn/shop/files/Headphone-Zone-Sony-WF-C510-Black-04.jpg?v=1727439368&width=2048",
        stock: 12
    },
    {
        name: "Smartphone Case",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIc0ThygrFZu0xd6_GpIkNPvvo15MkRdbm3g&s",
        stock: 3
    },
    {
        name: "Laptop",
        image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D",
        stock: 8
    },

    {
        name: "Mobile",
        image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlfGVufDB8fDB8fHww",
        stock: 10
    }
];

const productGrid = document.getElementById("productGrid");

products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="stock ${product.stock <= 3 ? 'low' : ''}">Stock: ${product.stock}</p>
      </div>
    `;
    productGrid.appendChild(card);
});*/
const productGrid = document.getElementById("productGrid");

// Fetch and render all products
fetch("/api/products")
  .then(response => response.json())
  .then(products => {
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      // Build inner HTML, showing buy controls only if in stock
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <h5>Category: ${product.category}</h5>
          <p class="stock">Price: ₹${product.price}</p>
          <p class="stock ${product.quantity <= 3 ? 'low' : ''}">
            Available: <span class="avail-count">${product.quantity}</span>
          </p>
          ${product.quantity > 0 ? `
            <input 
              type="number" 
              min="1" 
              max="${product.quantity}" 
              value="1" 
              class="buy-quantity" 
              placeholder="Enter quantity" 
            />
            <button 
              class="buy-button" 
              onclick='buy(this, ${JSON.stringify(product)})'
            >Buy</button>
          ` : `
            <p style="color: red; font-weight: bold;">Out of Stock</p>
          `}
        </div>
      `;

      productGrid.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Failed to fetch products:", error);
  });

/**
 * Handles Buy button clicks:
 *  - Validates quantity
 *  - Stores in localStorage cart
 *  - Shows toast
 *  - Decrements product.quantity and updates UI
 *  - Swaps to "Out of Stock" when quantity ≤ 0
 */
function buy(button, product) {
  const infoDiv = button.parentElement;
  const qtyInput = infoDiv.querySelector(".buy-quantity");
  const toBuy = parseInt(qtyInput.value, 10);

  if (toBuy > 0 && toBuy <= product.quantity) {
    // 1. Add to cart
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push({
      name: product.name,
      quantity: toBuy,
      category: product.category,
      price: product.price,
      image: product.image
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 2. Show success toast
    showToastAsync(`${product.name} added to cart!`, true);

    // 3. Decrease stock in-memory & update UI
    product.quantity -= toBuy;
    const availSpan = infoDiv.querySelector(".avail-count");
    availSpan.textContent = product.quantity;

    // 4. If now out of stock, remove controls & show label
    if (product.quantity <= 0) {
      qtyInput.remove();
      button.remove();
      const oos = document.createElement("p");
      oos.textContent = "Out of Stock";
      oos.style.color = "red";
      oos.style.fontWeight = "bold";
      infoDiv.appendChild(oos);
    } else {
      // also update input max so user can't exceed new stock
      qtyInput.max = product.quantity;
      if (parseInt(qtyInput.value, 10) > product.quantity) {
        qtyInput.value = product.quantity;
      }
    }

  } else {
    alert(`Please enter a valid quantity (1 to ${product.quantity})`);
  }
}

// Toast helper (green for success, red for warnings)
function showToastAsync(message, success) {
  return new Promise(resolve => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    toast.style.backgroundColor = success ? "#4CAF50" : "#f44336";

    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
      resolve();
    }, 3000);
  });
}

// Optional: if you want to keep low-stock warnings
async function fetchLowStock() {
  try {
    const response = await fetch("/api/products");
    const data = await response.json();
    for (const p of data) {
      if (p.quantity <= 5) {
        // red toast for low stock
        // (no UI-stock change here, just an alert)
        // await showToastAsync(`⚠️ ${p.name} - Only ${p.quantity} left!`, false);
      }
    }
  } catch (err) {
    console.error("Low-stock check failed:", err);
  }
}
// Run low-stock check 3s after load, then every 30s
setTimeout(fetchLowStock, 3000);
setInterval(fetchLowStock, 30000);
