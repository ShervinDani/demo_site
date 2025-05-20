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

fetch("/api/products")
  .then(response => response.json())
  .then(async products => {
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
		  <h5>Category: ${product.category}</h5>
          <p class="stock"> Price: ₹${product.price}</p>
          <p class="stock ${product.stock <= 3 ? 'low' : ''}">Available: ${product.quantity}</p>
          <input type="number" min="1" max="${product.quantity}" value="1" class="buy-quantity" />
          <button class="buy-button" onclick='buy(this, ${JSON.stringify(product)})'>Buy</button>
        </div>
      `;
      productGrid.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Failed to fetch products:", error);
  });

  function buy(button, product) {
    const quantityInput = button.parentElement.querySelector(".buy-quantity");
    const quantityToBuy = parseInt(quantityInput.value);

    if (quantityToBuy > 0 && quantityToBuy <= product.quantity) {
      const itemToStore = {
        name: product.name,
        quantity: quantityToBuy,
		category: product.category,
        price: product.price,
        image: product.image
      };

      const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
      cart.push(itemToStore);
      localStorage.setItem("cartItems", JSON.stringify(cart));
	  showToastAsync(`${itemToStore.name} added to cart!`,true);

    } else {
      alert(`Please enter a valid quantity (1 to ${product.quantity})`);
    }
  }

  
  
  
  function showToastAsync(message,bool) {
    return new Promise((resolve) => {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.className = "toast show";
	  if(bool)
		{
			toast.style.backgroundColor = "#4CAF50";
		}
	 else
	 {
		toast.style.backgroundColor = "#f44336";
	 }
      setTimeout(() => {
        toast.className = toast.className.replace("show", "");
        resolve(); // Proceed to next toast after 3s
      }, 3000);
    });
  }

  
  async function fetchLowStock() {
    const response = await fetch('/api/products');
    const data = await response.json();
    console.log(data);
	
    // Sequential toast display
    for (let i = 0; i < data.length; i++) {
		if(data[i].quantity <= 5)
      await showToastAsync(`⚠️ ${data[i].name} - Only ${data[i].quantity} left in stock!`,false);
    }
  }
  setTimeout(fetchLowStock, 3000);   // First after 3s
  setInterval(fetchLowStock, 30000); // Then every 30s
