const swiperBanner = new Swiper('.banner .swiper', {
    loop: true,

    pagination: {
        el: '.banner .swiper-pagination',
        clickable: true
    }
})

const swiperPhoto = new Swiper('.swiper-photo', {
    slidesPerView: 'auto',
    speed: 500,

    scrollbar: {
        el: '.swiper-photo .swiper-scrollbar',
        draggable: true,
    },
})

const media = [document.querySelector('.swiper-photo .swiper-wrapper'), document.querySelector('.swiper-video .swiper-wrapper')]
media.forEach(item => {
    if (item.offsetHeight > 845) {
        while (item.offsetHeight > 945) {
            item.style.width = `${item.offsetWidth + item.offsetWidth * 0.1}px`
        }
    }
})
const mediaItemsVideo = document.querySelectorAll('.media__item_video')
if (mediaItemsVideo.length > 0) {
    mediaItemsVideo.forEach(item => {
        item.insertAdjacentHTML('beforeend', '<button></button>')
    })
}

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

// Табы
function tabClick(tab) {
    // Не забыть в html указать класс для родителя табов, чтобы он понимал взаимосвязь
    const parent = tab.closest('.tabs-parent')
    const tabs = parent.querySelectorAll('.tabs__tab')
    const contents = parent.querySelectorAll('.tabs__content')
    tabs.forEach(item => {
        item.classList.remove('tabs__tab_active')
        if (item === tab) tab.classList.add('tabs__tab_active')
    })

    contents.forEach(item => {
        item.classList.remove('tabs__content_active')
        if (item.dataset.tab === tab.dataset.tab) item.classList.add('tabs__content_active')
    })
}


// Popups
class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this._closeButton = this.popupElement.querySelector('.popup__close');
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this.popupElement.id}"]`)
        this.setEventListeners()
    }

    open(el) {
        document.body.style.overflow = "hidden";
        this.popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        if (el.tagName === 'PICTURE') {
            const picture = this.popupElement.querySelector('picture')
            if (picture) picture.remove()
            const copyElement = el.cloneNode(true)

            copyElement.removeAttribute('onclick')
            this.popupElement.querySelector('.popup__content').append(copyElement)
        }
    }

    close() {
        this.popupElement.classList.remove('popup_opened');
        document.body.style.overflow = "visible";
        document.removeEventListener('keydown', this._handleEscClose);
        if (this.popupElement.id === 'stories') stories.reset()
    }

    _handleEscClose(evt) {
        if (evt.keyCode === 27) {
            this.close();
        }
    }

    _handleOverlayClick(evt) {
        if (evt.target === evt.currentTarget) {
            this.close();
        }
    }

    setEventListeners() {
        this._openingLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); this.open(e.target) }))
        this._closeButton.addEventListener('click', () => this.close());
        this.popupElement.addEventListener('click', this._handleOverlayClick.bind(this));
    }
}

const popups = document.querySelectorAll('.popup')
let arrPopups = {}
document.addEventListener('DOMContentLoaded', () => {
    if (popups.length > 0) popups.forEach(item => {
        const popup = new Popup(item)
        arrPopups[item.id] = popup
    })
})




/* Сториз */
class Stories {
    constructor() {
        this.mainBlock = document.querySelector('#stories')
        if (this.mainBlock) {
            this.slides = this.mainBlock.querySelectorAll('.swiper-slide')
            this.progressSpans = this.mainBlock.querySelectorAll('.stories__progress span')
            this.nextButton = this.mainBlock.querySelector('.swiper-button-next')
            this.prevButton = this.mainBlock.querySelector('.swiper-button-prev')
            this.counters = [];
            this.time = 6000;
            this.swiperStories = new Swiper(".stories__swiper", {
                allowTouchMove: false,
                navigation: {
                    nextEl: '.stories .swiper-button-next',
                    prevEl: '.stories .swiper-button-prev',
                },
                autoHeight: true,
            })
            this.setEventListeners()
        }
    }

    onActiveSlide(index) {
        this.swiperStories.slideTo(index)
        this.activeSlide()
    }
    activeSlide() {
        const activeSlide = this.mainBlock.querySelector('.swiper-slide-active')

        this.nextButton.removeEventListener('click', this.handler1)
        this.nextButton.removeEventListener('click', this.handler2)

        if (activeSlide.id == this.slides.length) {
            this.nextButton.addEventListener('click', this.handler2)
        } else {
            this.nextButton.addEventListener('click', this.handler1)
        }


        const nextSlide = this.mainBlock.querySelector('.swiper-slide-next')
        const previousSlides = Array.from(this.mainBlock.querySelectorAll('.swiper-slide')).filter(item => item.id < activeSlide.id)
        if (previousSlides.length > 0) previousSlides.forEach(item => {
            const progressSpan = this.mainBlock.querySelector(`.stories__progress-block-${item.id} span`)
            progressSpan.style.width = '100%';
        })


        const progressSpanActive = this.mainBlock.querySelector(`.stories__progress-block-${activeSlide.id} span`)
        let timeActive = 0;
        this.intervalId = setInterval(() => {
            timeActive += 5
            progressSpanActive.style.width = `${(timeActive / this.time) * 100}%`
            if (timeActive === this.time) {
                clearInterval(this.intervalId)
                if (nextSlide) {
                    this.onActiveSlide(nextSlide.id - 1)
                } else {
                    this.closeStories()
                }
            }
        }, 1)
    }

    reset() {
        this.intervalId ? clearInterval(this.intervalId) : ''
        this.progressSpans.forEach(item => item.style.width = '0')
    }
    handler1 = () => {
        this.reset()
        this.activeSlide()
    }

    handler2 = () => {
        this.closeStories()
    }

    closeStories = () => {
        this.reset()
        arrPopups[this.mainBlock.id].close()
    }
    setEventListeners() {
        this.prevButton.addEventListener('click', () => {
            this.reset()
            this.activeSlide()
        })
    }
}

const stories = new Stories()