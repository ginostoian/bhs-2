const mobileNav = document.querySelector('.mobile-nav')
const navToggle = document.querySelector('.main-nav__menu')

navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('mobile-nav--visbile')
})