document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let currentUser = users.find((user) => user.isLogined === true);
  let basket = currentUser?.basket || [];
  let wishlist = currentUser?.wishlist || [];
  
  const getProducts = async () => {
    let response = await axios.get("https://fakestoreapi.com/products");
    return response.data;
  };

  let products = await getProducts();

  let loginBtn = document.querySelector(".login");
  let registerBtn = document.querySelector(".register");
  let logoutBtn = document.querySelector(".logout");
  let usernameBtn = document.querySelector(".username");
  let basketIcon = document.querySelector(".basketIcon sup");

  function updateUserStatus() {
    if (currentUser) {
      usernameBtn.textContent = currentUser.username;
      loginBtn.classList.add("d-none");
      registerBtn.classList.add("d-none");
      logoutBtn.classList.remove("d-none");
    } else {
      usernameBtn.textContent = "Username";
      loginBtn.classList.remove("d-none");
      registerBtn.classList.remove("d-none");
      logoutBtn.classList.add("d-none");
    }
  }

  function updateBasketCount() {
    let basketCount = currentUser?.basket.reduce((acc, item) => acc + item.count, 0) || 0;
    basketIcon.textContent = basketCount;
  }

  function logout() {
    if (currentUser) {
      currentUser.isLogined = false;
      localStorage.setItem("users", JSON.stringify(users));
      updateUserStatus();
      updateBasketCount();
    }
  }

  logoutBtn.addEventListener("click", logout);

  function addToBasket(productId) {
    if (!currentUser) {
      toast("Please log in to add items to your basket.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
      return;
    }

    let product = products.find((p) => p.id === productId);
    if (!product) return;

    let existingProduct = basket.find((item) => item.id === productId);
    if (existingProduct) {
      existingProduct.count++;
    } else {
      basket.push({
        ...product,
        count: 1,
        totalPrice: product.price,
      });
    }

    currentUser.basket = basket;
    let userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
    }
    localStorage.setItem("users", JSON.stringify(users));
    toast("Product added to basket!");
    updateBasketCount();
  }

  function toggleWishlist(productId, heartElement) {
    const productIndex = wishlist.findIndex((item) => item.id === productId);
    if (productIndex === -1) {
      wishlist.push({ id: productId, title: productId.title, image: productId.image });
      heartElement.classList.add("fa-solid");
      heartElement.classList.remove("fa-regular");
      toast("Product added to wishlist!");
    } else {
      wishlist.splice(productIndex, 1);
      heartElement.classList.remove("fa-solid");
      heartElement.classList.add("fa-regular");
      toast("Product removed from wishlist!");
    }

    currentUser.wishlist = wishlist;
    let userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
    }
    localStorage.setItem("users", JSON.stringify(users));
  }

  const URL = new URLSearchParams(location.search);
  const productId = URL.get("id");
  let findProduct = products.find((product) => product.id === parseInt(productId));

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

  let heart = document.createElement("i");
  heart.classList.add("fa-regular", "fa-heart", "card-heart");
  productImageDiv.append(productImg, heart);

  if (wishlist.some((item) => item.id === findProduct.id)) {
    heart.classList.add("fa-solid");
  }

  heart.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleWishlist(findProduct.id, heart);
  });

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

    toast("Product added to cart!");
    setTimeout(() => {
      window.location.href = "basket.html";
    }, 1300);
  });



  //! card

let relatedProducts = products.filter(
  (product) => product.category === findProduct.category && product.id !== findProduct.id
);

let relatedProductsContainer = document.createElement("div");
relatedProductsContainer.classList.add("related-products");




relatedProducts.slice(0, 3).forEach((relatedProduct) => {
  let relatedProductDiv = document.createElement("div");
  relatedProductDiv.classList.add("related-product");

  let relatedProductImg = document.createElement("img");
  relatedProductImg.classList.add("related-product-img");
  relatedProductImg.src = relatedProduct.image;
  relatedProductImg.alt = relatedProduct.title;

  let relatedProductTitle = document.createElement("p");
  relatedProductTitle.classList.add("related-product-title");
  relatedProductTitle.textContent = relatedProduct.title.slice(0,30)+" ...";

  let relatedProductPrice = document.createElement("p");
  relatedProductPrice.classList.add("related-product-price");
  relatedProductPrice.textContent = `$${relatedProduct.price.toFixed(2)}`;

  let addToBasketBtn = document.createElement("button");
  addToBasketBtn.classList.add("btn", "btn-secondary", "add-to-basket-btn");
  addToBasketBtn.textContent = "Add to Cart";

  addToBasketBtn.addEventListener("click", () => {
    addToBasket(relatedProduct.id);
  });

  relatedProductDiv.appendChild(relatedProductImg);
  relatedProductDiv.appendChild(relatedProductTitle);
  relatedProductDiv.appendChild(relatedProductPrice);
  relatedProductDiv.appendChild(addToBasketBtn);

  relatedProductsContainer.appendChild(relatedProductDiv);
});

productContainer.appendChild(relatedProductsContainer);










  function toast(message) {
    Toastify({
      text: message,
      duration: 1000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }





  
  updateUserStatus();
  updateBasketCount();
});
