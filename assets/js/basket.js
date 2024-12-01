let users = JSON.parse(localStorage.getItem("users"));
let currentUser = users.find((user) => user.isLogined === true);
let basket = currentUser.basket || [];

function createBasketItem() {
  let basketContainer = document.querySelector(".basket");
  basketContainer.innerHTML = "";
  if (basket.length > 0) {
    basket.forEach((product) => {
      let basketItem = document.createElement("div");
      basketItem.classList.add("basket-item");
      basketItem.setAttribute("data-id", product.id);

      let image = document.createElement("div");
      image.classList.add("image");
      image.style.cursor = "pointer";
      image.addEventListener("click", () => {
        window.location.href = `product_detail.html?id=${product.id}`;
      });

      let img = document.createElement("img");
      img.classList.add("imgBasket");

      let title = document.createElement("h4");
      title.classList.add("title");

      let category = document.createElement("p");
      category.classList.add("category");

      let price = document.createElement("p");
      price.classList.add("price");

      let countArea = document.createElement("div");
      countArea.classList.add("count-area");

      let minusBtn = document.createElement("button");
      minusBtn.classList.add("minus-btn");
      if (product.count === 1) {
        minusBtn.setAttribute("disabled", "true");
      }
      minusBtn.textContent = "-";

      minusBtn.addEventListener("click", () =>
        decrementCount(product.id, count, price, minusBtn)
      );

      let count = document.createElement("p");
      count.classList.add("count");
      count.textContent = "0";

      let plusBtn = document.createElement("button");
      plusBtn.classList.add("plus-btn");
      plusBtn.textContent = "+";

      plusBtn.addEventListener("click", () =>
        incrementCount(product.id, count, price, minusBtn)
      );

      let titlePrice = document.createElement("div");
      titlePrice.classList.add("title-price");
      titlePrice.append(title, price);

      // Remove Button
      let removeBtn = document.createElement("button");
      removeBtn.classList.add("btn", "btn-white", "remove-btn");
      removeBtn.textContent = "🗑️ Remove";
      removeBtn.addEventListener("click", () => removeProduct(product.id));

      // Wishlist Button (Heart Icon)
      let wishlistBtn = document.createElement("button");
      wishlistBtn.classList.add("btn", "btn-white", "wishlist-btn");
      let heartIcon = document.createElement("i");
      heartIcon.classList.add("fa-regular", "fa-heart","favIcon");
      let favoriteText = document.createElement("span")
      favoriteText.classList.add("favorite")
      favoriteText.textContent = "Favorite";
      wishlistBtn.append(heartIcon,favoriteText);
      wishlistBtn.addEventListener("click", () =>
        toggleAddWishlist(product.id, heartIcon)
      );

      // Category and Count
      let categoryCount = document.createElement("div");
      categoryCount.classList.add("category-count");
      categoryCount.append(category, countArea);

      // Button Area (Remove and Wishlist buttons)
      let removeBtnArea = document.createElement("div");
      removeBtnArea.classList.add("remove-btn-area");
      removeBtnArea.append(wishlistBtn,removeBtn, );

      

      let cardInfo = document.createElement("div");
      cardInfo.classList.add("cardInfo");
      cardInfo.append(titlePrice, categoryCount, removeBtnArea);

      // Append elements
      countArea.append(minusBtn, count, plusBtn);
      image.append(img);
      basketItem.append(image, cardInfo);

      basketContainer.append(basketItem);

      img.src = product.image;
      title.textContent = product.title;
      category.textContent = product.category;
      price.textContent = `$ ${product.price}`;
      count.textContent = product.count;

      let newPrice = product.price * product.count;
      price.textContent = `US $ ${newPrice.toFixed(2)}`;
    });
  }

  let clearBasketBtn = document.createElement("button");
clearBasketBtn.classList.add("btn","btn-outline-danger","clearAll");
clearBasketBtn.textContent = "Clear Basket";

clearBasketBtn.addEventListener("click", clearBasket);

function clearBasket() {
  
  basket = [];

  
  let basketItems = document.querySelectorAll(".basket-item");
  basketItems.forEach(item => item.remove());

  
  let userIndex = users.findIndex((user) => user.id === currentUser.id);
  users[userIndex].basket = [];
  localStorage.setItem("users", JSON.stringify(users));

  
  updateTotalPrice();
}
let bottom = document.querySelector(".bottom")
bottom.appendChild(clearBasketBtn);
  updateTotalPrice();
}


function toggleAddWishlist(productId, heartElement) {
  if (!currentUser) {
    toast("Please login to add to wishlist");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
    return;
  }

  let userIndex = users.findIndex((user) => user.id === currentUser.id);

  if (currentUser.wishList.some((item) => item.id === productId)) {
    let productIndex = currentUser.wishList.findIndex(
      (product) => product.id === productId
    );
    currentUser.wishList.splice(productIndex, 1);
    users[userIndex] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));

    heartElement.classList.remove("fa-solid");
    heartElement.classList.add("fa-regular");
    heartElement.style.color="#212121"
    let favorite =document.querySelectorAll(".favorite")
    favorite.forEach(element => {
element.style.color="#212121"      
    });

    toast("Product removed from wishlist");
  } else {
    let product = basket.find((product) => product.id === productId);
    currentUser.wishList.push(product);
    users[userIndex] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));

    heartElement.classList.remove("fa-regular");
    heartElement.classList.add("fa-solid");
    heartElement.style.color="#DF4244"
    let favorite =document.querySelectorAll(".favorite")
    favorite.forEach(element => {
      element.style.color="#DF4244"      
          });

    toast("Product added to wishlist");
  }
}


function incrementCount(
  productId,
  countElement,
  priceElement,
  minusBtnElement
) {
  let userIndex = users.findIndex((user) => user.id === currentUser.id);
  let exsistProduct = basket.find((product) => product.id === productId);

  if (exsistProduct) {
    exsistProduct.count++;
  }

  countElement.textContent = exsistProduct.count;

  if (exsistProduct.count > 0) {
    minusBtnElement.removeAttribute("disabled");
  }

  let newPrice = exsistProduct.price * exsistProduct.count;
  priceElement.textContent = `$ ${newPrice.toFixed(2)}`;

  users[userIndex].basket = basket;
  localStorage.setItem("users", JSON.stringify(users));
  updateTotalPrice();
}

function decrementCount(
  productId,
  countElement,
  priceElement,
  minusBtnElement
) {
  let userIndex = users.findIndex((user) => user.id === currentUser.id);
  let exsistProduct = basket.find((product) => product.id === productId);

  if (exsistProduct) {
    exsistProduct.count--;
  }

  countElement.textContent = exsistProduct.count;

  let newPrice = exsistProduct.price * exsistProduct.count;
  priceElement.textContent = `$ ${newPrice.toFixed(2)}`;

  if (exsistProduct.count === 1) {
    minusBtnElement.setAttribute("disabled", true);
  }

  users[userIndex].basket = basket;
  localStorage.setItem("users", JSON.stringify(users));
  updateTotalPrice();
}

function updateTotalPrice() {
  let totalPrice = 0;
  basket.forEach((product) => {
    totalPrice += product.price * product.count;
  });

  let total = document.querySelector(".total-price");
  total.textContent = `$ ${totalPrice.toFixed(2)}`;
}

function removeProduct(productId) {
  let userIndex = users.findIndex((user) => user.id === currentUser.id);
  let exsistProductIndex = basket.findIndex(
    (product) => product.id === productId
  );

  if (exsistProductIndex !== -1) {
    basket.splice(exsistProductIndex, 1);
    toast("Product removed from basket");
    users[userIndex].basket = basket;
    localStorage.setItem("users", JSON.stringify(users));
    createBasketItem();
  }
}

document.querySelector(".confirm").addEventListener("click", () => {
  if (basket.length === 0) {
    toast("Basket is empty!");
  } else {
    console.log("Products in the basket:", basket);
    toast("Proceeding with the basket...");
  }
});

function toast(text) {
  Toastify({
    text: `${text}`,
    duration: 2000,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
}

document.addEventListener("DOMContentLoaded", createBasketItem());




//! nav
document.addEventListener("DOMContentLoaded", async () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  const getProducts = async () => {
    let response = await axios("https://fakestoreapi.com/products");
    let products = response.data;
    return products;
  };
  let products = await getProducts();
  let filteredProducts = [...products];

  let loginBtn = document.querySelector(".login");
  let registerBtn = document.querySelector(".register");
  let logoutBtn = document.querySelector(".logout");
  let curentUser = users.find((user) => user.isLogined === true);

  

  let searchInput = document.querySelector(".search-input");
  let searchBtn = document.querySelector(".search-btn");
  let searchResultsList = document.querySelector(".search-results");

  

// !filtereme



  searchBtn?.addEventListener("click", () => {
    let searchvalue = searchInput.value.trim();
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchvalue.toLowerCase())
    );
    document.querySelector(".cards").innerHTML = "";
    createUserCard(filteredProducts);
    renderProducts(filteredProducts);
    updateSearchResults(filteredProducts)
  });

  searchInput?.addEventListener("input", () => {
    let searchvalue = searchInput.value.trim();
    filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchvalue.toLowerCase())
    );
    document.querySelector(".cards").innerHTML = "";
    createUserCard(filteredProducts);
    renderProducts(filteredProducts);
    updateSearchResults(filteredProducts)
  });


  function updateSearchResults(filteredProducts) {
    searchResultsList.innerHTML = "";

    filteredProducts.slice(0, 3).forEach((product) => {
      let listItem = document.createElement("li");
      listItem.classList.add("search-result-item");
      listItem.textContent = product.title;
      // let searchArea = document.querySelector(".search-results")


      let image = document.createElement("div");
      image.classList.add("search-image");
      let img = document.createElement("img");
      img.src = product.image;
      image.append(img);
      listItem.appendChild(image)

      listItem.addEventListener("click", () => {
        window.location.href = `product-detail.html?id=${product.id}`;
      });
      searchResultsList.appendChild(listItem);
    });
  }

  // searchInput.addEventListener("change", () => {
  //   let searchvalue = searchInput.value.trim();
  //   filteredProducts = products.filter((product) =>
  //     product.title.toLowerCase().includes(searchvalue.toLowerCase())
  //   );
  //   document.querySelector(".cards").innerHTML = "";
  //   createUserCard(filteredProducts);
  // });

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

  

 
  

  function toggleAddWishlist(productId, heartElement) {
    if (!curentUser) {
      toast("Please login to add wishlist");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
      return;
    }

    let userIndex = users.findIndex((user) => user.id === curentUser.id);

    if (curentUser.wishList.some((item) => item.id === productId)) {
      let productIndex = curentUser.wishList.findIndex(
        (product) => product.id === productId
      );
      curentUser.wishList.splice(productIndex, 1);
      users[userIndex] = curentUser;
      localStorage.setItem("users", JSON.stringify(users));

      heartElement.classList.remove("fa-solid");
      heartElement.classList.add("fa-regular");

      toast("Product removed from wishlist");
    } else {
      let product = products.find((product) => product.id === productId);
      curentUser.wishList.push(product);
      users[userIndex] = curentUser;
      localStorage.setItem("users", JSON.stringify(users));

      heartElement.classList.remove("fa-regular");
      heartElement.classList.add("fa-solid");

      toast("Product added to wishlist");
    }
  }

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

  
  



  function toast(text) {
    Toastify({
      text: `${text}`,
      duration: 1000,
      gravity: "top",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }
  updateBasketCount();
  updateUserStatus();
});




