function submitProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const category = document.getElementById("category").value.trim();
  const imageFile = document.getElementById("productImage").value.trim(); // assuming this is a text input for image URL

  const msg = document.getElementById("messageBox");

  if (!name || isNaN(price) || isNaN(quantity) || !category || !imageFile) {
    msg.textContent = "All fields including image are required.";
    msg.classList.add("show", "error");
    setTimeout(() => msg.classList.remove("show", "error"), 3000);
    return;
  }

  const productData = {
    name,
    price,
    quantity,
    category,
    image: imageFile
  };

  fetch("http://localhost:9090/addProducts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productData)
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to add product.");
      return response.text();
    })
    .then(data => {
      msg.textContent = data;
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 3000);

      // Reset form
      document.getElementById("productName").value = "";
      document.getElementById("price").value = "";
      document.getElementById("quantity").value = "";
      document.getElementById("category").value = "";
      document.getElementById("productImage").value = "";
    })
    .catch(error => {
      console.log("Error:", error);
      msg.textContent = "Error adding product.";
      msg.classList.add("show", "error");
      setTimeout(() => msg.classList.remove("show", "error"), 3000);
    });
}
