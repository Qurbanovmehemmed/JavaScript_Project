document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users"));
  let currentUser = users.find((user) => user.isLogined === true);

  function createWishlistItem(product) {
    let wishlistItem = document.createElement("div");
    wishlistItem.classList.add("card");
    wishlistItem.addEventListener("click", () => {
        window.location.href = `product_detail.html?id=${product.id}`;
    });

    let image = document.createElement("div");
    image.classList.add("card-image");
    let img = document.createElement("img");

    let cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    let cardTitle = document.createElement("h2");
    cardTitle.classList.add("card-title");

    let category = document.createElement("p");
    category.classList.add("card-category");

    let cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    let price = document.createElement("span");
    price.classList.add("card-price");

    let removeBtn = document.createElement("button");
    removeBtn.classList.add("btn", "btn-light", "remove-btn");
    removeBtn.innerHTML = `<i class="fa-solid fa-x"></i>`
    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        removeItem(product.id);
    });

    // Rating stars (optional based on your requirement)
    let starArea = document.createElement("div");
    starArea.classList.add("starArea");
    let star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star", "starCard");

    for (let i = 0; i < 5; i++) {
        let starClone = star.cloneNode(true);
        starArea.appendChild(starClone);
    }

    function removeItem(productId) {
        let userIndex = users.findIndex((user) => user.id === currentUser.id);
        let productIndex = currentUser.wishList.findIndex(
            (product) => product.id === productId
        );
        if (productIndex !== -1) {
            currentUser.wishList.splice(productIndex, 1);
            users[userIndex] = currentUser;
            localStorage.setItem("users", JSON.stringify(users));
            toast("Item removed from wishlist");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    cardContent.append(cardTitle, category, price);
    cardFooter.append(removeBtn);
    image.appendChild(img);
    wishlistItem.append( image, starArea, cardContent, cardFooter);

    let wishlistContainer = document.querySelector(".wishlist");
    wishlistContainer.appendChild(wishlistItem);

    img.src = product.image;
    cardTitle.textContent = product.title.slice(0, 30) + " ...";
    category.textContent = product.category;
    price.textContent = `$ ${product.price}`;
}

  if (currentUser.wishList.length > 0) {
    currentUser.wishList.forEach((product) => {
      createWishlistItem(product);
    });
  } else {
    let empty = document.createElement("h3");
    empty.classList.add("empty");
    empty.textContent = "Your wishlist is empty";
    let wishlistContainer = document.querySelector(".wishlist");
    wishlistContainer.appendChild(empty);
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
});



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
       
       window.location.href = "index.html"; 
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
