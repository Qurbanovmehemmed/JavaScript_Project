import productURL from "./baseURL.js";
import { deleteById, getDatas, postData } from "./request.js";
let products = await getDatas(productURL);

const createTable = async () => {
  products.forEach((product) => {
    let tableRow = document.createElement("tr");

    let tdId = document.createElement("td");
    tdId.classList.add("product-id");

    let tdImage = document.createElement("td");
    let img = document.createElement("img");
    img.classList.add("product-image");
    tdImage.appendChild(img);

    let tdTitle = document.createElement("td");
    tdTitle.classList.add("product-title");

    let tdCategory = document.createElement("td");
    tdCategory.classList.add("product-category");

    let tdPrice = document.createElement("td");
    tdPrice.classList.add("product-price");

    let actions = document.createElement("td");

    let editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteProduct(product.id);
    });

    tdId.textContent = product.id;
    img.src = product.image;
    tdTitle.textContent = product.title;
    tdCategory.textContent = product.category;
    tdPrice.textContent = product.price;

    actions.append(editButton, deleteButton);

    tableRow.append(tdId, tdImage, tdTitle, tdCategory, tdPrice, actions);

    let tbody = document.querySelector("tbody");

    tbody.appendChild(tableRow);
  });
};

const addProduct = async (e) => {
  e.preventDefault();
  let image = document.querySelector("#image").value;
  let title = document.querySelector("#title").value;
  let category = document.querySelector("#category").value;
  let price = document.querySelector("#price").value;

  let newProduct = {
    id: uuidv4(),
    image,
    title,
    category,
    price,
  };

  await postData(productURL, newProduct);
  createTable();
  closeModal();
};
let form = document.querySelector(".form");
form.addEventListener("submit", addProduct);

const deleteProduct = async (productId) => {
  await deleteById(productURL, productId);
};

const openModal = () => {
  let modal = document.querySelector(".row");
  modal.style.display = "flex";
};
let addButton = document.querySelector(".add-btn");
addButton.addEventListener("click", openModal);

const closeModal = () => {
  let modal = document.querySelector(".row");
  modal.style.display = "none";
};
let closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", closeModal);

createTable();
