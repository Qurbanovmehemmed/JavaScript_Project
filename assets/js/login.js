document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users"));
  let form = document.querySelector(".form");
  let username = document.querySelector("#username");
  let password = document.querySelector("#password");

  function login(e) {
    e.preventDefault();
    if (!users) {
      toast("No users found");
      return;
    }

    let findUser = users.find(
      (user) =>
        user.username === username.value && user.password === password.value
    );

    if (findUser) {
      findUser.isLogined = true;
      localStorage.setItem("users", JSON.stringify(users));
      toast("User logged in successfully");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      toast("User or password is incorrect");
      return;
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

  form.addEventListener("submit", login);
});
