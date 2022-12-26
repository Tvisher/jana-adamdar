'use strict';
import * as baseFunction from './modules/functions.js';
import './vendors/vendors.js';
import Swiper, { Navigation, Pagination, Mousewheel, EffectFade, Keyboard, Parallax, Manipulation, Thumbs } from 'swiper';

import IMask from 'imask';

// Проверка поддержки webP
baseFunction.testWebP();


const faqSlide = document.querySelector('.faq-slide');
faqSlide.addEventListener('scroll', (e) => {
    if (faqSlide.scrollTop < 1) {
        pageSlider.enable();
    } else {
        pageSlider.disable();
    }
});
const translateflyingShape = () => {
    Object.assign(document.querySelector('.flying-shape').style, {
        left: `${Math.random() * 60}%`,
        top: `${Math.random() * 60}%`,
    })
}


const marquee = document.querySelector('.marquee__wrapper');
let computedDuration;
if (window.innerWidth > 768) {
    computedDuration = 40000;
}
else {
    computedDuration = 15000;
};

$('#marquee').marquee({
    startVisible: true,
    duration: computedDuration,
    delayBeforeStart: 0,
    direction: 'left',
    duplicated: true,
});


let pageScreens = document.querySelectorAll('[data-title]');
let pageScreensTitles = [];
pageScreens.forEach(slide => {
    pageScreensTitles.push(slide.dataset.title);
});


const pageSliderPagination = new Swiper('.page-slider_pagination', {
    modules: [Manipulation],
    speed: 600,
    allowTouchMove: false,
    spaceBetween: 8,
    slidesPerView: 5,
    centeredSlides: 1,
    centeredSlidesBounds: 1,
    direction: 'vertical',
    watchSlidesProgress: true,
    on: {
        init(swiper) {
            pageScreensTitles.forEach((slide, index) => {
                const pagNum = String((index + 1)).padStart(2, '0');
                const pagSlide = `
                <div class="slider-pag swiper-slide">
                    <div class="num">${pagNum}</div>
                    <div class="title">${slide}</div>
                </div>
                `;
                swiper.addSlide(index, pagSlide);
            })

        },
        click(swiper, event) {
            const clickedSlide = event.target.closest('.swiper-slide');
            const currentSlideIndex = swiper.slides.findIndex(item => item == clickedSlide);
            pageSlider.enable();
            pageSlider.slideTo(currentSlideIndex);
        }
    },
});


var pageSlider = new Swiper('.page-slider', {
    modules: [Navigation, Pagination, Mousewheel, Keyboard, Parallax, Manipulation, Thumbs, EffectFade],
    speed: 800,
    wrapperClass: "page-slider__wrapper",
    slideClass: "page-screen",
    noSwipingClass: 'swiper-no-swiping',
    direction: 'vertical',
    slidesPerView: 'auto',
    init: false,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    keyboard: {
        enable: true,
        onlyInViewport: true,
        pageUpDown: true,
    },
    mousewheel: {
        sensitivity: 1,
        eventsTarget: '.page-slider__wrapper',
    },
    thumbs: {
        swiper: pageSliderPagination,
    },
    on: {
        init() {
            pageSliderPagination.slides[0].classList.add('slide-active');
            translateflyingShape();
        },
        slideChange(swiper) {
            if (swiper.activeIndex == 0) {
                marquee.classList.remove('show');
                marquee.classList.remove('half-show');
            }
            else if (swiper.activeIndex == 1) {
                marquee.classList.add('show');
                marquee.classList.add('no-arrow');
                marquee.classList.remove('half-show');
            }
            else {
                marquee.classList.remove('show');
                marquee.classList.remove('no-arrow');
                marquee.classList.add('half-show');
            }

            pageSliderPagination.slides.forEach(slide => {
                slide.classList.remove('slide-active');
            });
            pageSliderPagination.slides[swiper.realIndex].classList.add('slide-active');
            pageSliderPagination.slideTo(swiper.realIndex);
            translateflyingShape();
        },
        slideChangeTransitionStart(slider) {
            // Выключение слайдера при попадании на слайд faq
            if (slider.slides[slider.realIndex].classList.contains('faq-slide')) {
                faqSlide.scrollTo(0, 10);
                setTimeout(() => {
                    pageSlider.disable();
                }, 200);
                document.querySelector('.page-slider_pagination').style.display = 'none';
            }
            else {
                document.querySelector('.page-slider_pagination').style.display = 'block';
            }
        }
    }
});


var modalSlider = new Swiper('.modal-slider', {
    modules: [Mousewheel, Keyboard, EffectFade],
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    direction: 'vertical',
    speed: 1200,
    keyboard: {
        enable: true,
        onlyInViewport: true,
        pageUpDown: true,
    },
    mousewheel: {
        sensitivity: 1,
    },
    on: {
        slideChange(swiper) {
            const currentSlide = swiper.slides[swiper.activeIndex];
            if (currentSlide.classList.contains('orange')) {
                document.body.classList.add('orange')
            } else {
                document.body.classList.remove('orange')
            }
        }
    }

});


// preloader
const preloader = document.querySelector('#preloader.show');
if (preloader) {
    const preloaderSvg = preloader.querySelector('svg');
    preloaderSvg.classList.add('active');
    setTimeout(() => {
        preloader.classList.remove('show');
        // pageSlider.init();
    }, 3500);
}

document.querySelectorAll('[data-lang-select]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelector('.lang-selection').classList.remove('show');
        setTimeout(() => {
            pageSlider.init();
        }, 200);
    });
})




// Отработка кликов в документе
document.body.addEventListener('click', (e) => {
    const target = e.target;
    // Открытие и закрытие меню
    if (target.closest('[data-open-menu]')) {
        target.closest('[data-open-menu]').classList.toggle('active');
        document.querySelector('[data-mega-menu]').classList.toggle('show');
        document.body.classList.toggle('open-menu');
    }
    // Закрытие модалки при клике вне контента
    if (target.closest('[data-modal].show') && !target.closest('.lider-modal__content')) {
        document.querySelector(`[data-modal].show`)?.classList.remove('show');
        cleanBodyClasses();
    }
    // Открытие модальных окон
    if (target.closest('[data-open-modal]')) {
        const targetid = target.closest('[data-open-modal]').getAttribute('data-open-modal');
        document.querySelector(`[data-modal="${targetid}"]`)?.classList.add('show');
        cleanBodyClasses();
    }
    // Откытие бегущей строки
    if (target.closest('.marquee-open')) {
        marquee.classList.toggle('show');
        marquee.classList.toggle('half-show');
    }
    // Открытие модального окна с формой
    if (target.closest('[data-open-form-modal]')) {
        document.querySelector('#form-modal')?.classList.add('show');
        cleanBodyClasses();
    }

    // Кнопки навигации по слайдам
    if (target.closest('[data-slide-to]')) {
        e.preventDefault();
        pageSlider.enable();
        cleanBodyClasses();
        const dataSlideId = target.closest('[data-slide-to]').getAttribute('data-slide-to');
        const currentSlide = [...pageSlider.slides].findIndex(slide => slide.getAttribute('data-slide') == dataSlideId);
        pageSlider.slideTo(currentSlide);
        setTimeout(() => {
            document.querySelector('[data-open-menu]')?.classList.remove('active');
            document.querySelector('[data-mega-menu]')?.classList.remove('show');
        }, 400);
    }

    // Закрытие модально окна по кнопке
    if (target.closest('.form-modal__close')) {
        const closeBtn = target.closest('.form-modal__close');
        closeBtn.closest('.show').classList.remove('show');
        cleanBodyClasses();
    }

    // Открытие манифеста по лику на кнопку
    if (target.closest('#open-text-war')) {
        document.querySelector('.modal-slider').classList.add('show');
        document.body.classList.add('manifest');
    }
});

// Закрытие модалок и меню по нажатию на Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelector('[data-open-menu].active')?.classList.remove('active');
        document.querySelector('[data-mega-menu].show')?.classList.remove('show');
        document.querySelector('[data-modal].show')?.classList.remove('show');
    }
});


// Фукция для сброса классов с тега body
function cleanBodyClasses() {
    document.body.classList.remove('manifest');
    document.body.classList.remove('orange');
    document.querySelector('.modal-slider').classList.remove('show');
    setTimeout(() => {
        modalSlider.slideTo(0);
    }, 350);
};


//Аккардеон секции faq
$("[data-toggle-elem]").click(function () {
    $(this).parent().toggleClass('open')
    $(this).parent().find("[data-toggle-content]").slideToggle("slow");
});

// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7}(000) 000-00-00',
        lazy: false,
        placeholderChar: 'X'
    });
});



$(document).ready(function () {
    $('#city-select').select2({
        minimumResultsForSearch: -1,
    });
});



// Карточки для модального окна с мероприятием
(function () {
    $(".res-item__drop").click(function () {
        $(this).parent().toggleClass('open')
        $(this).parent().find(".res-item__body").slideToggle("slow");
    });

    document.querySelectorAll('.res-item__input').forEach(input => {
        input.addEventListener('change', (e) => {
            document.querySelector('.res-item.selected')?.classList.remove('selected');
            e.target.closest('.res-item')?.classList.add('selected');
        });
    });
})();