let totalSum = 0;
let discountPrice = 0;
const taxRate = 0.18;

const reviewContainer = document.getElementById("review-items-container");
const items = JSON.parse(localStorage.getItem("cartItems")) || [];

items.forEach(item => {
  const productName = item.name;

  fetch(`http://localhost:9090/checkout/getDiscount/${encodeURIComponent(productName)}`)
    .then(response => response.json())
    .then(discount => {
      fetch(`http://localhost:9090/checkout/getQuantity/${encodeURIComponent(productName)}`)
        .then(response => response.json())
        .then(quantityAvailable => {

          if (quantityAvailable < item.quantity) {
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="product-image">
              <div>
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p style="color:red;">Out Of Stock</p>
              </div>
            `;
            reviewContainer.appendChild(card);
          } else {
            fetch(`http://localhost:9090/checkout/reduceQuantity/${encodeURIComponent(productName)}/${encodeURIComponent(item.quantity)}`, {
              method: 'PUT'
            })
              .then(response => {
                if (!response.ok) {
                  console.log(response);
                  throw new Error('Failed to reduce quantity');
                }
              })
              .catch(error => console.error(error));

            const actualPrice = item.price * item.quantity;
            const discounted = actualPrice * (1 - discount / 100);

            totalSum += actualPrice;
            discountPrice += discounted;
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
              <img src="${item.image}" alt="${item.name}" class="product-image">
              <div>
                <h3>${item.name}</h3>
                <p>Category: ${item.category}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Actual Price: ₹${actualPrice.toFixed(2)}</p>
                <p>Offer Price: ₹${discounted.toFixed(2)}</p>
              </div>
            `;
            reviewContainer.appendChild(card);
            document.getElementById("totalSum").innerHTML = `Total Amount: <span>₹${totalSum.toFixed(2)}</span>`;
            document.getElementById("discountPrice").innerHTML = `Offer Price: <span id="discount">₹${discountPrice.toFixed(2)}</span>`;
            document.getElementById("tax").innerHTML = `Tax (18%): <span>₹${(discountPrice * taxRate).toFixed(2)}</span>`;
            document.getElementById("saved").innerHTML = `Saved: <span>₹${(totalSum - discountPrice).toFixed(2)}</span>`;
            document.getElementById("finalTotal").innerHTML = `Total: <span id="total">₹${(discountPrice * (1 + taxRate)).toFixed(2)}</span>`;
          }

        })
        .catch(error => {
          console.error('Error fetching quantity:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching discount:', error);
    });
});

function pay() {

	window.print();

}
