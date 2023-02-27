const toggleButtons = document.querySelectorAll('.faq-toggle');

toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.parentNode.classList.toggle('active');
    })
})