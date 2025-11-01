document.addEventListener("DOMContentLoaded", () => {
  async function loadComponent(placeholderId, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("فایل یافت نشد: " + filePath);
      const html = await response.text();
      document.getElementById(placeholderId).innerHTML = html;
      initializeEvents();
    } catch (error) {
      console.log("خطا در بارگذاری:", filePath, error);
    }
  }

  function initializeEvents() {
    const dropdownToggles = document.querySelectorAll(
      ".sidebar-menu .dropdown-toggle"
    );

    dropdownToggles.forEach((toggle) => {
      toggle.removeEventListener("click", handleDropdownToggle);
      toggle.addEventListener("click", handleDropdownToggle);
    });

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar-menu");
    const mobileOverlay = document.getElementById("mobile-overlay");

    if (menuToggle && sidebar && mobileOverlay) {
      menuToggle.removeEventListener("click", handleMenuToggle);
      menuToggle.addEventListener("click", handleMenuToggle);

      mobileOverlay.removeEventListener("click", handleMobileOverlay);
      mobileOverlay.addEventListener("click", handleMobileOverlay);
    }

    // باز نگه‌داشتن آیتم فعال در سایدبار
    document
      .querySelectorAll(".sidebar-menu .menu-item.current")
      .forEach((item) => {
        if (item.classList.contains("has-dropdown")) {
          item.classList.add("open");
          const dropdownMenu = item.querySelector(".dropdown-menu");
          if (dropdownMenu)
            dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
        }
      });
  }

  function handleDropdownToggle(event) {
    const toggle = event.currentTarget;
    const parentLi = toggle.closest(".menu-item");

    if (parentLi && parentLi.classList.contains("has-dropdown")) {
      event.preventDefault();
      const dropdownMenu = parentLi.querySelector(".dropdown-menu");

      if (parentLi.classList.contains("open")) {
        parentLi.classList.remove("open");
        if (dropdownMenu) dropdownMenu.style.maxHeight = "0";
      } else {
        document
          .querySelectorAll(".sidebar-menu .menu-item.open")
          .forEach((otherLi) => {
            otherLi.classList.remove("open");
            const otherDropdown = otherLi.querySelector(".dropdown-menu");
            if (otherDropdown) otherDropdown.style.maxHeight = "0";
          });
        parentLi.classList.add("open");
        if (dropdownMenu)
          dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
      }
    } else if (parentLi && !parentLi.classList.contains("has-dropdown")) {
      document
        .querySelectorAll(".sidebar-menu .menu-item.open")
        .forEach((otherLi) => {
          otherLi.classList.remove("open");
          const otherDropdown = otherLi.querySelector(".dropdown-menu");
          if (otherDropdown) otherDropdown.style.maxHeight = "0";
        });
    }
  }

  function handleMenuToggle() {
    const sidebar = document.getElementById("sidebar-menu");
    const mobileOverlay = document.getElementById("mobile-overlay");

    if (sidebar && mobileOverlay) {
      sidebar.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
    }
  }

  function handleMobileOverlay() {
    const sidebar = document.getElementById("sidebar-menu");
    const mobileOverlay = document.getElementById("mobile-overlay");

    if (sidebar && mobileOverlay) {
      sidebar.classList.remove("active");
      mobileOverlay.classList.remove("active");
    }
  }

  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split("/").pop().split(".")[0];
    const sidebarLinks = document.querySelectorAll("#sidebar-menu a");

    sidebarLinks.forEach((link) => {
      const linkClass = link.classList[0];
      if (linkClass === currentPath) {
        document.querySelectorAll(".sidebar-menu .current").forEach((el) => {
          el.classList.remove("current");
        });
        link.closest(".dropdown-toggle").classList.add("current");
      }
    });
  }

  function logout() {
    const logoutBtn = document.querySelector('.logout');
    const currentPath = '/' + window.location.pathname.split('/').pop();
    const redirect = (url) => {
      if (window.location.pathname !== url && currentPath !== url) {
        window.location.replace(url);
      }
    };
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem("currentUser")
      redirect('/index.html');
    })
  }



  // اجرای بارگذاری Navbar و Sidebar برای همه صفحات
  Promise.all([
    loadComponent("nav-bar-placeholder", "components/navbar.html"),
    loadComponent("sidebar-placeholder", "components/sidebar.html"),
  ])
    .then(() => {
      highlightCurrentPage();
      initializeEvents();
      logout()
    })
    .catch((error) => {
      console.error(error);
    });
});
