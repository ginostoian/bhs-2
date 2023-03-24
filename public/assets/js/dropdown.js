const dropdownBtn = document.querySelector("#dropdown-item");
const dropdownMenu = document.querySelector("#dropdown-menu");

const dropdownBtnMobile = document.querySelector(".dropdown-item-mobile");
const dropdownMenuMobile = document.querySelector(".dropdown-menu-mobile");

const toggleNav = () => {
  dropdownMenu.classList.toggle("dropdown-menu-visible");
};

dropdownBtn.addEventListener("mouseenter", (e) => {
  e.preventDefault();
  toggleNav();
});

dropdownMenu.addEventListener("mouseleave", (e) => {
  e.preventDefault();
  toggleNav();
});

dropdownBtnMobile.addEventListener("click", (e) => {
  e.preventDefault();
  dropdownMenuMobile.classList.toggle("dropdown-menu-visible-mobile");
});
