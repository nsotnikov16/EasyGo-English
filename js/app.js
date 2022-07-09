const swiperBanner = new Swiper('.banner .swiper', {
    loop: true,

    pagination: {
        el: '.banner .swiper-pagination',
        clickable: true
    }
})

/* Спойлеры */
const spoilers = document.querySelectorAll('.spoiler')
if (spoilers.length > 0) {
    spoilers.forEach(spoiler => {
        const top = spoiler.querySelector('.spoiler__top')
        top.addEventListener('click', () => {
            spoiler.classList.toggle('spoiler_open')
        })
    })
}