document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined === true);
  let basket = currentUser?.basket || [];

  let URL = new URLSearchParams(location.search);
  let productId = URL.get("id");

  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    const products = response.data;

    let findProduct = products.find(
      (product) => product.id === parseInt(productId)
    );

    if (!findProduct) {
      console.error("Product not found!");
      return;
    }

    let productContainer = document.querySelector(".product-container");

    let productImageDiv = document.createElement("div");
    productImageDiv.classList.add("product-image");

    let productImg = document.createElement("img");
    productImg.classList.add("img");
    productImg.src = findProduct.image;
    productImg.alt = findProduct.title;
    productImageDiv.appendChild(productImg);

    let productDetailsDiv = document.createElement("div");
    productDetailsDiv.classList.add("product-details");

    let productTitle = document.createElement("h1");
    productTitle.classList.add("product-title");
    productTitle.textContent = findProduct.title;
    productDetailsDiv.appendChild(productTitle);

    let productCategory = document.createElement("p");
    productCategory.classList.add("product-category");
    productCategory.textContent = `Category: ${findProduct.category}`;
    productDetailsDiv.appendChild(productCategory);

    let productPrice = document.createElement("p");
    productPrice.classList.add("product-price");
    productPrice.textContent = `$${findProduct.price.toFixed(2)}`;
    productDetailsDiv.appendChild(productPrice);

    let productDescription = document.createElement("p");
    productDescription.classList.add("product-description");
    productDescription.textContent = findProduct.description;
    productDetailsDiv.appendChild(productDescription);

    let quantitySelector = document.createElement("div");
    quantitySelector.classList.add("quantity-selector");

    let btnMinus = document.createElement("button");
    btnMinus.classList.add("btn-minus");
    btnMinus.textContent = "-";
    quantitySelector.appendChild(btnMinus);

    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = "1";
    quantityInput.min = "1";
    quantitySelector.appendChild(quantityInput);

    let btnPlus = document.createElement("button");
    btnPlus.classList.add("btn-plus");
    btnPlus.textContent = "+";
    quantitySelector.appendChild(btnPlus);

    productDetailsDiv.appendChild(quantitySelector);

    let addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add("btn", "btn-danger", "add-to-cart-btn");
    addToCartBtn.textContent = "Add to Cart";
    productDetailsDiv.appendChild(addToCartBtn);

    productContainer.appendChild(productImageDiv);
    productContainer.appendChild(productDetailsDiv);

    btnMinus.addEventListener("click", () => {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    btnPlus.addEventListener("click", () => {
      let currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });

    addToCartBtn.addEventListener("click", () => {
      let quantity = parseInt(quantityInput.value);
      let totalPrice = quantity * findProduct.price;

      let existingProduct = basket.find((item) => item.id === findProduct.id);
      if (existingProduct) {
        existingProduct.count += quantity;
        existingProduct.totalPrice += totalPrice;
      } else {
        basket.push({
          id: findProduct.id,
          title: findProduct.title,
          image: findProduct.image,
          price: findProduct.price,
          count: quantity,
          totalPrice: totalPrice,
          category: findProduct.category,
        });
      }

      currentUser.basket = basket;
      let userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
      }
      localStorage.setItem("users", JSON.stringify(users));

      toasts("Product added to cart!");
      setTimeout(() => {
        window.location.href = "basket.html";
      }, 1300);
    });

    function toasts(text) {
      Toastify({
        text: text,
        duration: 1000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }

  } catch (error) {
    console.error("Error fetching products: ", error);
  }
});



document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const getProducts = async () => {
    let response = await axios("https://fakestoreapi.com/products");
    let products = response.data;
    return products;
  };
  let products = await getProducts();
  

  let loginBtn = document.querySelector(".login");
  let registerBtn = document.querySelector(".register");
  let logoutBtn = document.querySelector(".logout");
  let curentUser = users.find((user) => user.isLogined === true);



  




  


  function updateUserStatus() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isLogined = users.find((user) => user.isLogined === true);
    let usernameBtn = document.querySelector(".username");
    if (isLogined) {
      usernameBtn.textContent = isLogined.username;
      loginBtn.classList.add("d-none");
      registerBtn.classList.add("d-none");
      logoutBtn.classList.remove("d-none");
    } else {
      logoutBtn.classList.add("d-none");
      loginBtn.classList.remove("d-none");
      registerBtn.classList.remove("d-none");
      usernameBtn.textContent = "Username";
    }
  }

  function logout() {
    if (curentUser) {
      curentUser.isLogined = false;
      localStorage.setItem("users", JSON.stringify(users));
      updateUserStatus();
    }
  }

  logoutBtn.addEventListener("click", logout);

  

  function addBasket(productId) {
    if (!curentUser) {
      toast("Please login to add basket");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    }

    let userIndex = users.findIndex((user) => user.id === curentUser.id);

    if (userIndex === -1) {
      toast("User not found");
      return;
    }
    let basket = curentUser.basket || [];
    let exsistProduct = basket.find((product) => product.id === productId);

    if (exsistProduct) {
      exsistProduct.count++;
    } else {
      let product = products.find((product) => product.id === productId);
      if (product) {
        curentUser.basket.push({ ...product, count: 1 });
      }
    }
    toast("Product added to basket");
    users[userIndex] = curentUser;
    localStorage.setItem("users", JSON.stringify(users));
    updateBasketCount();
  }

  function updateBasketCount() {
    let basketElement = document.querySelector(".basketIcon sup");
    let basketCount = curentUser?.basket.reduce(
      (acc, product) => acc + product.count,
      0
    );
    basketElement.textContent = basketCount;
  }

 
  



 
  updateBasketCount();
  updateUserStatus();
});
