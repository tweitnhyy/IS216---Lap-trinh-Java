const registrationButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");

registrationButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});
