/*
 *!
 * Start Bootstrap - Agency v6.0.3 (https://startbootstrap.com/theme/agency)
 * Copyright 2013-2020 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
 */
(function ($) {
  'use strict'

  // start of use strict

  // smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (
      location.pathname.replace(/^\//, '') ==
                this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
    ) {
      let target = $(this.hash)
      target = target.length
        ? target
        : $(`[name=${this.hash.slice(1)}]`)
      if (target.length) {
        $('html, body').animate(
          {
            scrollTop: target.offset().top - 72
          },
          1000,
          'easeInOutExpo'
        )

        return false
      }
    }
  })

  // closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(() => {
    $('.navbar-collapse').collapse('hide')
  })

  // activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 74
  })

  // collapse Navbar
  const navbarCollapse = function () {
    if ($('#mainNav').offset().top > 100) {
      $('#mainNav').addClass('navbar-shrink')
    } else {
      $('#mainNav').removeClass('navbar-shrink')
    }
  }
  // collapse now if page is not at top
  navbarCollapse()
  // collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse)
}(jQuery)) // end of use strict

const logOut = () => {
  localStorage.removeItem('pcToken')
  window.location.replace('/')
}

const backArea = document.querySelector('.back')
const goSigninSectionButton = document.querySelector('.goSigninSection')
const goBackSection = document.querySelector('.goBackSection')
const signArea = document.querySelector('.signArea')
const signUpHead = document.querySelector('.signUpHead')
if (localStorage.getItem('pcToken')) {
  backArea.style = 'display: block;'
  goBackSection.style = 'display:inline block;'
  signArea.style = 'display: none;'
  goSigninSectionButton.style = 'display: none;'
  signUpHead.href = '#back'
  signUpHead.innerText = 'back'
} else {
  backArea.style = 'display: none;'
  goBackSection.style = 'display: none;'
  signArea.style = 'display: block;'
  goSigninSectionButton.style = 'display: inline block;'
  signUpHead.href = '#contact'
  signUpHead.innerText = 'Sign-Up'
}
