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
      // minusBtn.setAttribute("disabled", "true");
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

      let removeBtn = document.createElement("button");
      removeBtn.classList.add("btn", "btn-danger", "remove-btn");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => removeProduct(product.id));

      countArea.append(minusBtn, count, plusBtn);
      image.append(img);
      basketItem.append(image, title, category, price, countArea, removeBtn);

      let basketContainer = document.querySelector(".basket");
      basketContainer.append(basketItem);

      img.src = product.image;
      title.textContent = product.title.slice(0, 10) + " ...";
      category.textContent = product.category;
      price.textContent = `$ ${product.price}`;
      count.textContent = product.count;

      let newPrice = product.price * product.count;
      price.textContent = `$ ${newPrice.toFixed(2)}`;
    });
  }
  updateTotalPrice();
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
