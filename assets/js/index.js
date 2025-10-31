/**
 * Template Name: iPortfolio
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Updated: Jun 29 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

"use strict";

/* Start Header Toggle*/
const headerToggleBtn = document.querySelector(".header-toggle");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const hamburgerContainer = document.querySelector(".hamburger-container");
const topbar = document.querySelector(".topbar");
const btns = document.querySelectorAll(".hamburger__btn--container button");
const menuItems = document.querySelectorAll(".hamburger-nav > ul > li");
const arrowIcon = document.querySelector(".hamburger-icon");
const socialLinks = document.querySelector(".social-links");
const mobileNav = document.querySelector(".mobile-nav-toggle");

// ---------------------- زیرمنوها ----------------------
const toggleSubMenu = (link) => {
  const item = link.closest("li");
  const subMenu = item.querySelector(".hamburger-sub");
  const arrowIcon = link.querySelector("img"); // فلش داخل لینک

  if (!subMenu) return;

  const isOpen = subMenu.classList.contains("open");

  // بستن سایر زیرمنوها
  document.querySelectorAll(".hamburger-sub.open").forEach((openSub) => {
    if (openSub !== subMenu) {
      openSub.style.height = 0;
      openSub.classList.remove("open");
    }
  });

  // باز یا بسته کردن زیرمنوی فعلی
  if (!isOpen) {
    subMenu.style.height = subMenu.scrollHeight + "px";
    subMenu.classList.add("open");
    if (arrowIcon)
      arrowIcon.setAttribute("src", "assets/images/svg/arrow-up-s-line.svg");
  } else {
    subMenu.style.height = 0;
    subMenu.classList.remove("open");
    if (arrowIcon)
      arrowIcon.setAttribute("src", "assets/images/svg/arrow-down-s-line.svg");
  }
};

// فعال‌سازی زیرمنوها و تعیین حالت اولیه فلش‌ها
menuItems.forEach((item) => {
  const link = item.querySelector("a");
  const subMenu = item.querySelector(".hamburger-sub");

  // تعیین فلش اولیه بسته
  if (arrowIcon) {
    arrowIcon.setAttribute("src", "assets/images/svg/arrow-down-s-line.svg");
  }

  if (subMenu) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSubMenu(link);
    });
  }
});
// menuItems.forEach((item) => {
//   const link = item.querySelector("a");
//   const subMenu = item.querySelector(".hamburger-sub");
//   const arrowIcon = link?.querySelector(".hamburger-icon"); // ← فلش مخصوص همون آیتم

//   if (arrowIcon) {
//     arrowIcon.setAttribute("src", "assets/images/svg/arrow-down-s-line.svg");
//   }

//   if (subMenu) {
//     link.addEventListener("click", (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       toggleSubMenu(link);
//     });
//   }
// });

// ---------------------- منوی اصلی ----------------------
const toggleHamburger = () => {
  const isActive = hamburgerContainer.classList.contains("active");

  if (!isActive) {
    mobileNav.classList.add("active");
    hamburgerContainer.classList.add("active");
    hamburgerMenu.classList.add("active");
    headerToggleBtn.classList.toggle("bi-x");
    headerToggleBtn.classList.add("clicked");
    topbar.classList.add("transparent");
    socialLinks.classList.add("d-none");
  } else {
    mobileNav.classList.remove("active");
    hamburgerContainer.classList.remove("active");
    hamburgerMenu.classList.remove("active");
    headerToggleBtn.classList.toggle("bi-x");
    topbar.classList.remove("transparent");
    socialLinks.classList.remove("d-none");

    document.querySelectorAll(".hamburger-sub.open").forEach((sub) => {
      sub.style.height = 0;
      sub.classList.remove("open");
    });
  }
};

// ---------------------- بستن منو ----------------------
const closeHamburger = () => {
  mobileNav.classList.remove("active");
  hamburgerContainer.classList.remove("active");
  hamburgerMenu.classList.remove("active");
  headerToggleBtn.classList.toggle("bi-x");
  topbar.classList.remove("transparent");
  socialLinks.classList.remove("d-none");

  // بستن تمام زیرمنوها
  document.querySelectorAll(".hamburger-sub.open").forEach((sub) => {
    sub.style.height = 0;
    sub.classList.remove("open");
  });
};

function highlightCurrentPage() {
  const currentPath = window.location.pathname.split("/").pop().split(".")[0];
  const navmenuLinks = document.querySelectorAll(".navmenu > ul > li > a");
  const hambeurgerLinks = document.querySelectorAll(
    ".hamburger-nav >ul >li > a"
  );

  if (window.innerWidth < 1199) {
    hambeurgerLinks.forEach((link) => {
      const classValue = link.classList[0];
      if (classValue === currentPath) {
        link.classList.add("active");
      }
    });
  }
  navmenuLinks.forEach((link) => {
    const classValue = link.classList[0];
    if (classValue === currentPath) {
      link.classList.add("active");
    }
  });
}

// ---------------------- کنترل اسکرول ----------------------
const handleScroll = () => {
  window.innerHeight < 700
    ? hamburgerMenu.classList.add("overflow")
    : hamburgerMenu.classList.remove("overflow");
};

// ---------------------- انیمیشن hover روی دکمه‌ها ----------------------
const hoverBtn = (element, size) => {
  element
    .closest(".hamburger__btn--container")
    .querySelector("div").style.width = size === "enter" ? "100%" : "0";
};
const load = () => {
  handleScroll();
  highlightCurrentPage();
};
const resize = () => {
  handleScroll();
  highlightCurrentPage();
};

// ---------------------- Event Listeners ----------------------
hamburgerMenu.addEventListener("click", (e) => e.stopPropagation());
headerToggleBtn.addEventListener("click", toggleHamburger);
hamburgerContainer.addEventListener("click", closeHamburger);
document.addEventListener("DOMContentLoaded", () => load());
window.addEventListener("resize", () => resize());

btns.forEach((btn) => {
  btn.addEventListener("mouseenter", () => hoverBtn(btn, "enter"));
  btn.addEventListener("mouseleave", () => hoverBtn(btn, ""));
});

/* End Header Toggle*/

/* start menuHover */
const lis = document.querySelectorAll(".navmenu >ul >li");
const Submenu = document.querySelector(".navmenu >ul >li .hosts__nav");
lis.forEach((li) => {
  li.addEventListener("mouseenter", () => {
    if (li.lastElementChild.classList.contains("hosts__nav")) {
      Submenu.classList.add("active");
    }
  });
  li.addEventListener("mouseleave", () => {
    if (li.lastElementChild.classList.contains("hosts__nav")) {
      Submenu.classList.remove("active");
    }
  });
});
/* end menuHover */

/**
 * Toggle mobile nav dropdowns
 */
// document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
//   navmenu.addEventListener("click", function (e) {
//     e.preventDefault();
//     this.parentNode.classList.toggle("active");
//     this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
//     e.stopImmediatePropagation();
//   });
// });

/**
 * Preloader
 */
// const preloader = document.querySelector("#preloader");
// if (preloader) {
//   window.addEventListener("load", () => {
//     preloader.remove();
//   });
// }

/**
 * Scroll top button
 */
// let scrollTop = document.querySelector('.scroll-top');

// function toggleScrollTop() {
//   if (scrollTop) {
//     window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
//   }
// }
// scrollTop.addEventListener('click', (e) => {
//   e.preventDefault();
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth'
//   });
// });

// window.addEventListener('load', toggleScrollTop);
// document.addEventListener('scroll', toggleScrollTop);

/**
 * Animation on scroll function and init
 */
// function aosInit() {
//   AOS.init({
//     duration: 600,
//     easing: 'ease-in-out',
//     once: true,
//     mirror: false
//   });
// }
// window.addEventListener('load', aosInit);

/**
 * Init typed.js
 */
// const selectTyped = document.querySelector(".typed");
// if (selectTyped) {
//   let typed_strings = selectTyped.getAttribute("data-typed-items");
//   typed_strings = typed_strings.split(",");
//   new Typed(".typed", {
//     strings: typed_strings,
//     loop: true,
//     typeSpeed: 100,
//     backSpeed: 50,
//     backDelay: 2000,
//   });
// }

/**
 * Initiate Pure Counter
 */
// new PureCounter();

/**
 * Animate the skills items on reveal
 */
// let skillsAnimation = document.querySelectorAll(".skills-animation");
// skillsAnimation.forEach((item) => {
//   new Waypoint({
//     element: item,
//     offset: "80%",
//     handler: function (direction) {
//       let progress = item.querySelectorAll(".progress .progress-bar");
//       progress.forEach((el) => {
//         el.style.width = el.getAttribute("aria-valuenow") + "%";
//       });
//     },
//   });
// });

/**
 * Initiate glightbox
 */
// const glightbox = GLightbox({
//   selector: '.glightbox'
// });

/**
 * Init isotope layout and filters
 */
// document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
//   let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
//   let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
//   let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

//   let initIsotope;
//   imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
//     initIsotope = new Isotope(
//       isotopeItem.querySelector(".isotope-container"),
//       {
//         itemSelector: ".isotope-item",
//         layoutMode: layout,
//         filter: filter,
//         sortBy: sort,
//       }
//     );
//   });

//   isotopeItem
//     .querySelectorAll(".isotope-filters li")
//     .forEach(function (filters) {
//       filters.addEventListener(
//         "click",
//         function () {
//           isotopeItem
//             .querySelector(".isotope-filters .filter-active")
//             .classList.remove("filter-active");
//           this.classList.add("filter-active");
//           initIsotope.arrange({
//             filter: this.getAttribute("data-filter"),
//           });
//           if (typeof aosInit === "function") {
//             aosInit();
//           }
//         },
//         false
//       );
//     });
// });

/**
 * Init swiper sliders
 */
// function initSwiper() {
//   document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
//     let config = JSON.parse(
//       swiperElement.querySelector(".swiper-config").innerHTML.trim()
//     );

//     if (swiperElement.classList.contains("swiper-tab")) {
//       initSwiperWithCustomPagination(swiperElement, config);
//     } else {
//       new Swiper(swiperElement, config);
//     }
//   });
// }
// window.addEventListener("load", initSwiper);

/**
 * Correct scrolling position upon page load for URLs containing hash links.
 */
// window.addEventListener("load", function (e) {
//   if (window.location.hash) {
//     if (document.querySelector(window.location.hash)) {
//       setTimeout(() => {
//         let section = document.querySelector(window.location.hash);
//         let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
//         window.scrollTo({
//           top: section.offsetTop - parseInt(scrollMarginTop),
//           behavior: "smooth",
//         });
//       }, 100);
//     }
//   }
// });

/**
 * Navmenu Scrollspy
 */
// let navmenulinks = document.querySelectorAll(".navmenu a");
// function navmenuScrollspy() {
//   navmenulinks.forEach((navmenulink) => {
//     if (!navmenulink.hash) return;
//     let section = document.querySelector(navmenulink.hash);
//     if (!section) return;
//     let position = window.scrollY + 200;
//     if (
//       position >= section.offsetTop &&
//       position <= section.offsetTop + section.offsetHeight
//     ) {
//       document
//         .querySelectorAll(".navmenu a.active")
//         .forEach((link) => link.classList.remove("active"));
//       navmenulink.classList.add("active");
//     } else {
//       navmenulink.classList.remove("active");
//     }
//   });
// }
// window.addEventListener("load", navmenuScrollspy);
// document.addEventListener("scroll", navmenuScrollspy);
