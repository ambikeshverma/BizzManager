document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("show");
  });
});