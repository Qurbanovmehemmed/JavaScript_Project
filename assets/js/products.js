
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
  
    let azBtn = document.querySelector(".az");
    let zaBtn = document.querySelector(".za");
  
    let searchInput = document.querySelector(".search-input");
    let searchBtn = document.querySelector(".search-btn");
    let searchResultsList = document.querySelector(".search-results");
  
    
  
  // !filtereme
    let lowToHighBtn = document.querySelector(".low-to-high");
    let highToLowBtn = document.querySelector(".high-to-low");
  
    lowToHighBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      filteredProducts = products.sort((a, b) => a.price - b.price);
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      renderProducts(filteredProducts);
      
    });
  
    highToLowBtn?.addEventListener("click", () => {
      filteredProducts = products.sort((a, b) => b.price - a.price);
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      renderProducts(filteredProducts);
    });
  
    azBtn?.addEventListener("click", () => {
      let filteredProducts = products.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      renderProducts(filteredProducts);
    });
  
    zaBtn?.addEventListener("click", () => {
      let filteredProducts = products.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      renderProducts(filteredProducts);
    });
  
    searchBtn?.addEventListener("click", () => {
      let searchvalue = searchInput.value.trim();
      filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchvalue.toLowerCase())
      );
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      updateSearchResults(filteredProducts)
      renderProducts(filteredProducts);
    });
  
    searchInput?.addEventListener("input", () => {
      let searchvalue = searchInput.value.trim();
      filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchvalue.toLowerCase())
      );
      document.querySelector(".cards").innerHTML = "";
      createUserCard(filteredProducts);
      updateSearchResults(filteredProducts)
      renderProducts(filteredProducts);
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
  
    function createUserCard(filteredProducts) {
      filteredProducts.forEach((product) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.addEventListener("click", () => {
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
        // let cardDescription = document.createElement("p");
        // cardDescription.classList.add("card-description");
        let cardFooter = document.createElement("div");
        cardFooter.classList.add("card-footer");
        let price = document.createElement("span");
        price.classList.add("card-price");
        let rating = document.createElement("div");
        rating.classList.add("card-rating");
        let ratingStar = document.createElement("span");
        let count = document.createElement("span");
        let heart = document.createElement("i");
        let starArea =document.createElement("div");
        starArea.classList.add("starArea")
         let star = document.createElement("i")
         star.classList.add("fa-solid", "fa-star", "starCard")
  
         let star1 = document.createElement("i")
         star1.classList.add("fa-solid", "fa-star", "starCard")
  
         let star2 = document.createElement("i")
         star2.classList.add("fa-solid", "fa-star", "starCard")
  
         let star3 = document.createElement("i")
         star3.classList.add("fa-solid", "fa-star", "starCard")
  
         let star4 = document.createElement("i")
         star4.classList.add("fa-solid", "fa-star", "starCard")
         starArea.append(star,star1,star2,star3,star4)
  
  
        heart.classList.add("fa-regular", "fa-heart", "card-heart");
        heart.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleAddWishlist(product.id, heart);
        });
  
        let addToCart = document.createElement("button");
        addToCart.classList.add("btn", "btn-primary", "add-to-cart");
        addToCart.textContent = "Add to card";
  
        addToCart.addEventListener("click", (e) => {
          e.stopPropagation();
          addBasket(product.id);
        });
  
  
        // let viewAll = document.querySelector(".allProduct");
  
        // viewAll.addEventListener("click", () => {
        //   let slices = document.querySelectorAll(".slice");
        //   let cards = document.querySelector(".cards");
        //   cards.style.display="flex"
          
        //   slices.forEach(slice => {
        //     slice.style.display = "none";
            
        //   });
        // });
  
        rating.append(ratingStar, count);
        cardFooter.append(price, rating);
        cardContent.append(cardTitle,  cardFooter);
        image.append(img);
        card.append(heart, image,starArea, cardContent, addToCart);
        let cards = document.querySelector(".cards");
        cards?.append(card);
        
  
        img.src = product.image;
        cardTitle.textContent = product.title.slice(0, 30) + " ...";
        category.textContent = product.category;
        price.textContent = `$${product.price}`;
        ratingStar.textContent = product.rating.rate;
        count.textContent = `(${product.rating.count})`;
      });
    }
    

//! filter
function renderProducts(productsToRender) {

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let isLogined = users.find((user) => user.isLogined === true);
    let currentUser = isLogined ? isLogined : null;

    document.querySelector(".cards").innerHTML = ""; 
    productsToRender.forEach((product) => {
      let card = document.createElement("div");
      card.classList.add("card");

      card.addEventListener("click", () => {
        window.location.href = `product_detail.html?id=${product.id}`;
      });

      let image = document.createElement("div");
      image.classList.add("card-image");

      let img = document.createElement("img");

      let cardContent = document.createElement("div");
      cardContent.classList.add("card-content");

      let cardTitle = document.createElement("h2");
      cardTitle.classList.add("card-title");

      let category = document.createElement("h2");
      category.classList.add("card-category");

      let cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");

      let price = document.createElement("span");
      price.classList.add("card-price");

      let rating = document.createElement("div");
      rating.classList.add("card-rating");

      let ratingStar = document.createElement("span");
      let count = document.createElement("span");
        // Rating stars
    let starArea = document.createElement("div");
    starArea.classList.add("starArea");
    let star = document.createElement("i");
    star.classList.add("fa-solid", "fa-star", "starCard");

    for (let i = 0; i < 5; i++) {
        let starClone = star.cloneNode(true);
        starArea.appendChild(starClone);
    }

      let heart = document.createElement("i");
      heart.classList.add("far", "fa-heart", "card-heart", "removeCard");

      if (
        currentUser &&
        currentUser.wishList.some((item) => item.id === product.id)
      ) {
        heart.classList.remove("far");
        heart.classList.add("fas");
      }

      heart.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleAddWishlist(product.id, heart);
      });

      let addToCart = document.createElement("button");
      addToCart.classList.add("btn", "btn-primary", "add-to-cart");
      addToCart.textContent = "Add Basket";

      addToCart.addEventListener("click", (e) => {
        e.stopPropagation();
        addBasket(product.id);
      });

      //! start

      rating.append(ratingStar, count);
      cardFooter.append(price, rating);
      cardContent.append(cardTitle, category, cardFooter);
      image.append(img);
      card.append(heart, image,starArea, cardContent, addToCart);
      
      let cards = document.querySelector(".cards");
      cards.append(card);

      img.src = product.image;
      cardTitle.textContent = product.title.slice(0, 20) + " ...";
      category.textContent = product.category;

      price.textContent = `$${product.price}`;
      ratingStar.textContent = product.rating.rate;
      count.textContent = `$${product.rating.count}`;
    });
  }

  
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
        window.location.reload()
  
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
    renderProducts(filteredProducts);
    updateBasketCount();
    updateUserStatus();
    createUserCard(filteredProducts);
  });
  