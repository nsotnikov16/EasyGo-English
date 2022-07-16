/* Анимации */
AOS.init();

const header = document.querySelector('.header')
const headerSocials = header.querySelector('.header__socials')
const buttonSocials = header.querySelector('.header__socials a:first-child')
const burger = header.querySelector('.header__burger')
const burgerPanel = document.querySelector('.panel__item')
buttonSocials.addEventListener('click', () => headerSocials.classList.toggle('open-list'))
burger.addEventListener('click', () => header.classList.toggle('header_show-mobile'))
burgerPanel.addEventListener('click', () => header.classList.add('header_show-mobile'))
const bottomPanel = document.querySelector('.panel')
const setPositionPanel = () => {
    const scroll = Math.ceil(window.scrollY)
    if (scroll > 560) bottomPanel.classList.remove('no-fixed')
    if (scroll <= 560) bottomPanel.classList.add('no-fixed')
}
setPositionPanel()
window.addEventListener('scroll', setPositionPanel)

function animateWord(block) {
    let words = block.dataset.text.split(' ')
    words.forEach(word => {
        let spanWord = document.createElement('span')
        let space = document.createElement('span')
        space.textContent = " "
        space.style.display = 'inline'
        spanWord.classList.add('word')
        block.append(spanWord)
        block.append(space)

        word.split('').forEach((letter, ind) => {
            let spanLetter = document.createElement('span');
            spanLetter.innerText = letter;
            spanLetter.classList.add('letter')
            spanWord.append(spanLetter)
        })
    })

    const letters = block.querySelectorAll('.letter')
    letters.forEach((letter, ind) => letter.style.cssText = `animation-delay: ${ind == 0 ? 0 : (ind / 2) / 10}s;`)

}

const swiperBanner = new Swiper('.banner .swiper', {
    loop: true,
    speed: 1000,
    autoplay: {
        delay: 5000,
        /*  disableOnInteraction: false */
    },
    pagination: {
        el: '.banner .swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return `<div class="timer ${className}">
            <span class="timer__runner"></span>
            <span class="timer__runner timer__runner--stay"></span>
            <span class="timer__runner timer__runner--bg"></span>
          </div>`
        }
    },
    on: {
        slideChange: function () {
            const bannersSlides = document.querySelectorAll('.banner .swiper .swiper-slide')
            setTimeout(() => {
                bannersSlides.forEach(item => {
                    const title = item.querySelector('.banner__title')
                    const letters = item.querySelectorAll('.letter')
                    const subTitle = item.querySelector('.banner__subtitle')
                    const arr = [title, subTitle]
                    arr.forEach(el => el.classList.remove('aos-animate'))
                    letters.forEach(letter => letter.classList.remove('letter_animate'))
                    if (item.classList.contains('swiper-slide-active')) {
                        arr.forEach(el => el.classList.add('aos-animate'))
                        letters.forEach(letter => letter.classList.add('letter_animate'))
                    }
                })
            }, 20)
        },
    },
})
const titlesBanner = document.querySelectorAll('.banner__title');
titlesBanner.forEach(title => animateWord(title))

let paramsMedia = {
    slidesPerView: 'auto',
    speed: 500,
    freeMode: true,
    /* mousewheel: true, */
    scrollbar: {
        el: '.swiper-photo .swiper-scrollbar',
        draggable: true,
    },
    on: {
        init: function () {
            media.forEach(item => setWidthMedia(item))
        }
    }
}

function setWidthMedia(item) {

    if (item.offsetHeight > 845 && window.innerWidth > 767) {
        while (item.offsetHeight > 945) {
            item.style.width = `${item.offsetWidth + item.offsetWidth * 0.1}px`
        }
    }

    if (item.offsetHeight > 380 && window.innerWidth <= 767) {
        while (item.offsetHeight > 420) {
            item.style.width = `${item.offsetWidth + item.offsetWidth * 0.1}px`
        }
    }
}

const media = [document.querySelector('.swiper-photo .swiper-wrapper'), document.querySelector('.swiper-video .swiper-wrapper')]
const swiperPhoto = new Swiper('.swiper-photo', paramsMedia)
const swiperVideo = new Swiper('.swiper-video', paramsMedia)

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

    if (tab.closest('.section_media')) {
        media.forEach(item => setWidthMedia(item))
    }
}


// Popups
class Popup {
    constructor(popupElement) {
        this.popupElement = popupElement;
        this._closeButton = this.popupElement.querySelector('.popup__close');
        this._img = this.popupElement.querySelector('.popup__img') ?? ''
        this._handleEscClose = this._handleEscClose.bind(this)
        this._openingLinks = document.querySelectorAll(`[data-pointer="${this.popupElement.id}"]`)
        this.setEventListeners()
    }

    open(el) {
        document.body.style.overflow = "hidden";
        this.popupElement.classList.add('popup_opened')
        document.addEventListener('keydown', this._handleEscClose);
        if (this._img && el.src) this._img.src = el.src
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

// Плавный скролл
const anchors = [].slice.call(document.querySelectorAll('.scroll')),
    animationTime = 400,
    framesCount = 20;

function scroll(item) {
    let element = document.querySelector(item.getAttribute('href'))
    if (!element) return
    // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
    let coordY = element.getBoundingClientRect().top + window.pageYOffset;

    // запускаем интервал, в котором
    let scroller = setInterval(function () {
        // считаем на сколько скроллить за 1 такт
        let scrollBy = coordY / framesCount;

        // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
        // и дно страницы не достигнуто
        if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
            // то скроллим на к-во пикселей, которое соответствует одному такту
            window.scrollBy(0, scrollBy);
        } else {
            // иначе добираемся до элемента и выходим из интервала
            window.scrollTo(0, coordY);
            clearInterval(scroller);
        }
        // время интервала равняется частному от времени анимации и к-ва кадров
    }, animationTime / framesCount);

}

anchors.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault()
    if (item.closest('.header__mobile')) header.classList.remove('header_show-mobile')
    setTimeout(() => scroll(item), 10)

}))


const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
document.addEventListener('DOMContentLoaded', () => {
    const signups = document.querySelectorAll('[data-socials="true"]')
    const messengers = document.querySelector('.socials_hover')
    signups.forEach(item => item.addEventListener(isMobile ? 'click' : 'mouseenter', () => {
        item.append(messengers)
        setTimeout(() => messengers.classList.add('open'), 100)
    }))

    document.addEventListener(isMobile ? 'click' : 'mousemove', (e) => {
        if (!e.target.closest('.socials_hover') && !e.target.closest('[data-socials="true"]')) messengers.classList.remove('open')
        /*  if (!e.target.closest('.header__messengers')) inserted.classList.remove('open-list') */
    })
})


const aboutMore = document.querySelector('#about .more')
const tooltip = document.querySelector('.tooltip')
if (aboutMore && tooltip) {
    aboutMore.addEventListener(isMobile ? 'click' : 'mouseenter', () => tooltip.classList.add('tooltip_show'))
    //aboutMore.addEventListener(isMobile ? 'click' : 'mouseout', () => tooltip.classList.remove('tooltip_show'))
    document.addEventListener(isMobile ? 'click' : 'mouseout', ({ target }) => {
        if (target !== aboutMore && !target.closest('.tooltip')) tooltip.classList.remove('tooltip_show')
    })
}


window.onload = () => {
    document.body.classList.remove('loading')
    swiperBanner.slideToLoop(0, 500, false)
}