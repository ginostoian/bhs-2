const wrapper = document.querySelector('.wrapper');
const indicators = [...document.querySelectorAll('.indicators button')];
const leftControl = document.querySelector('.arrow-container-left')
const rightControl = document.querySelector('.arrow-container-right')

let currentTestimonial = 0; // Default 0

indicators.forEach((item, i) => {
    item.addEventListener('click', () => {
        indicators[currentTestimonial].classList.remove('active');
        wrapper.style.marginLeft = `-${100 * i}%`;
        item.classList.add('active');
        currentTestimonial = i;
    })
})

leftControl.addEventListener('click', () => {
    if (currentTestimonial > 0) {
        indicators[currentTestimonial].classList.remove('active');
        currentTestimonial--
        wrapper.style.marginLeft = `-${100 * currentTestimonial}%`
        indicators[currentTestimonial].classList.add('active')
    }
})

rightControl.addEventListener('click', () => {
    if (currentTestimonial < indicators.length - 1) {
        indicators[currentTestimonial].classList.remove('active');
        currentTestimonial++
        wrapper.style.marginLeft = `-${100 * currentTestimonial}%`
        indicators[currentTestimonial].classList.add('active')
    }
})