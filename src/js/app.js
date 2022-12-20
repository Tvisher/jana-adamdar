'use strict';
import * as baseFunction from './modules/functions.js';
import './vendors/vendors.js';
import Swiper, { Navigation, Pagination, Mousewheel, EffectFade, Keyboard, Parallax, Manipulation, Thumbs } from 'swiper';

import IMask from 'imask';

// Проверка поддержки webP
baseFunction.testWebP();

window.addEventListener('load', (e) => {
    document.body.style.opacity = 1;
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

        }
    },
});

const flyingShape = document.querySelector('.flying-shape');
const translateflyingShape = () => {
    Object.assign(flyingShape.style, {
        left: `${Math.random() * 60}%`,
        top: `${Math.random() * 60}%`,
    })
}
const pageSlider = new Swiper('.page-slider', {
    modules: [Navigation, Pagination, Mousewheel, Keyboard, Parallax, Manipulation, Thumbs, EffectFade],
    speed: 800,
    wrapperClass: "page-slider__wrapper",
    slideClass: "page-screen",
    noSwipingClass: 'swiper-no-swiping',
    // Вертикальный слайдер
    direction: 'vertical',
    // parallax: true,
    // Колличество слайдев для показа
    slidesPerView: 'auto',
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    keyboard: {
        //Вкл/Выкл
        enable: true,
        //Вкл/Выкл только когда слайдер в пределах вьюпорта
        onlyInViewport: true,
        //Вкл/Выкл упрапвление клавишами pageUp pageDown
        pageUpDown: true,
    },
    mousewheel: {
        // Чувствительность колеса мыши
        sensitivity: 1,
        //Класс обьекта на котором буддет срабатывать прокрутка мышью
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
            pageSliderPagination.slides.forEach(slide => {
                slide.classList.remove('slide-active');
            });
            pageSliderPagination.slides[swiper.realIndex].classList.add('slide-active');
            pageSliderPagination.slideTo(swiper.realIndex);
            translateflyingShape();
        }
    }
});





//логика работы меню бургер
document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('[data-open-menu]')) {
        target.closest('[data-open-menu]').classList.toggle('active');
        document.querySelector('[data-mega-menu]').classList.toggle('show');
    }
    if (target.closest('[data-slide-to]')) {
        e.preventDefault();
        const dataSlideId = target.closest('[data-slide-to]').getAttribute('data-slide-to');
        const currentSlide = [...pageSlider.slides].findIndex(slide => slide.getAttribute('data-slide') == dataSlideId);
        pageSlider.slideTo(currentSlide);
        setTimeout(() => {
            document.querySelector('[data-open-menu]')?.classList.remove('active');
            document.querySelector('[data-mega-menu]')?.classList.remove('show');
        }, 500);
    }
});

// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7}(000) 000-00-00'
    });
});



