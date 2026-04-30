// ============================================
// PIXELPORT MAIN JS (FINAL FIXED VERSION - NO NOTIFICATIONS)
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  const html = document.getElementById("htmlRoot");
  const body = document.body;

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");

  const themeToggle = document.getElementById("themeToggle");
  const rtlToggle = document.getElementById("rtlToggle");

  const userMenu = document.getElementById("userMenu");
  const authLinks = document.getElementById("authLinks");
  const adminItem = document.getElementById("adminDashboardMenuItem");

  // ============================================
  // THEME (NO NOTIFICATION)
  // ============================================
  const savedTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.getAttribute("data-theme");
      const newTheme = current === "dark" ? "light" : "dark";

      // Add ripple animation
      themeToggle.style.transform = "scale(0.9)";
      setTimeout(() => {
        themeToggle.style.transform = "scale(1)";
      }, 150);

      // Fade transition for body
      body.style.transition = "background-color 0.3s ease, color 0.3s ease";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // NO TOAST NOTIFICATION
    });
  }

  // ============================================
  // RTL (NO NOTIFICATION)
  // ============================================
  const savedDir = localStorage.getItem("dir") || "ltr";
  html.setAttribute("dir", savedDir);

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      const isRTL = html.getAttribute("dir") === "rtl";
      const newDir = isRTL ? "ltr" : "rtl";

      // Animate button
      rtlToggle.style.transform = "rotate(180deg)";
      setTimeout(() => {
        rtlToggle.style.transform = "rotate(0deg)";
      }, 300);

      html.setAttribute("dir", newDir);
      localStorage.setItem("dir", newDir);

      // NO TOAST NOTIFICATION
    });
  }

  // ============================================
  // HAMBURGER (STABLE FIX)
  // ============================================
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");

      hamburger.classList.toggle("active", isOpen);
      body.classList.toggle("menu-open", isOpen);

      // Create/remove overlay
      if (isOpen) {
        createOverlay();
      } else {
        removeOverlay();
      }
    });
  }

  // Create overlay when menu opens
  function createOverlay() {
    let overlay = document.querySelector(".menu-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "menu-overlay";
      document.body.appendChild(overlay);
    }
    setTimeout(() => overlay.classList.add("active"), 10);
    overlay.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      body.classList.remove("menu-open");
      overlay.classList.remove("active");
    });
  }

  function removeOverlay() {
    const overlay = document.querySelector(".menu-overlay");
    if (overlay) {
      overlay.classList.remove("active");
      setTimeout(() => overlay.remove(), 300);
    }
  }

  // ============================================
  // CLOSE MENU ONLY FOR REAL LINKS
  // ============================================
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {

      // ❗ Only close if NOT dropdown trigger
      if (link.classList.contains("dropdown-trigger")) return;

      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      body.classList.remove("menu-open");
      removeOverlay();

    });
  });

  // ============================================
  // RESET ON RESIZE
  // ============================================
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      body.classList.remove("menu-open");
      removeOverlay();
    }
  });

  // ============================================
  // MOBILE DROPDOWN (FIXED)
  // ============================================
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {

      if (window.innerWidth <= 1024) {
        e.preventDefault();

        const dropdown = trigger.closest(".dropdown");
        const isActive = dropdown.classList.contains("active");

        // Close others
        document.querySelectorAll(".dropdown").forEach(d => {
          if (d !== dropdown) d.classList.remove("active");
        });

        dropdown.classList.toggle("active");

        // Animate arrow
        const arrow = trigger.querySelector(".dropdown-arrow");
        if (arrow) {
          arrow.style.transform = isActive ? "rotate(0deg)" : "rotate(180deg)";
        }

      }
    });
  });

  // ============================================
  // AUTH FIX (SHOW DASHBOARD)
  // ============================================
  const savedUser = localStorage.getItem("pixelportUser");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);

      if (userMenu) userMenu.style.display = "block";
      if (authLinks) authLinks.style.display = "none";

      if (user.role === "admin" && adminItem) {
        adminItem.style.display = "block";
      }

    } catch (e) {
      console.error("User parse error", e);
    }
  }

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll(".category-card, .product-card, .service-card, .stat-card");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.classList.add("reveal-on-scroll");
    observer.observe(el);
  });

  // ============================================
  // NEWSLETTER FORM WITH ANIMATION
  // ============================================
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector("input");
      const email = emailInput?.value.trim();

      if (email && email.includes("@") && email.includes(".")) {
        const button = newsletterForm.querySelector("button");
        const originalText = button.innerHTML;

        // Animate button
        button.style.transform = "scale(0.95)";
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          SUBSCRIBED!
        `;
        button.style.background = "#10b981";

        setTimeout(() => {
          button.style.transform = "scale(1)";
          button.innerHTML = originalText;
          button.style.background = "";
        }, 3000);

        emailInput.value = "";
        showToast("🎉 Thanks for subscribing!", "success");
      } else {
        const button = newsletterForm.querySelector("button");
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          INVALID EMAIL
        `;
        button.style.background = "#ef4444";

        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = "";
        }, 3000);

        showToast("❌ Please enter a valid email address", "error");
      }
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  let lastScroll = 0;
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hide/show header on scroll (optional)
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    lastScroll = currentScroll;
  });

  // ============================================
  // ADD TO CART ANIMATIONS
  // ============================================
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Animate button
      this.style.transform = "scale(0.95)";
      this.innerHTML = "✓ ADDED!";
      this.style.background = "#10b981";
      
      setTimeout(() => {
        this.style.transform = "scale(1)";
        this.innerHTML = "Add to Cart";
        this.style.background = "";
      }, 1500);
      
      // Update cart count animation
      const cartCount = document.querySelector(".cart-count");
      if (cartCount) {
        const currentCount = parseInt(cartCount.innerText) || 0;
        cartCount.innerText = currentCount + 1;
        cartCount.style.transform = "scale(1.3)";
        setTimeout(() => {
          cartCount.style.transform = "scale(1)";
        }, 300);
      }
      
      showToast("🎮 Added to cart!", "success");
    });
  });

  // ============================================
  // TOAST NOTIFICATION FUNCTION
  // ============================================
  window.showToast = function(message, type = "success") {
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notification";

    let icon = "";
    let bgColor = "";
    
    switch(type) {
      case "success":
        icon = "✅";
        bgColor = "#10b981";
        break;
      case "error":
        icon = "❌";
        bgColor = "#ef4444";
        break;
      case "info":
        icon = "ℹ️";
        bgColor = "#3b82f6";
        break;
      default:
        icon = "🎮";
        bgColor = "#10b981";
    }

    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: ${bgColor};
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      z-index: 10000;
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      font-family: 'Inter', sans-serif;
    `;

    toast.innerHTML = `<span style="font-size: 16px;">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(0)";
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(100px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // ============================================
  // ADD CSS ANIMATIONS
  // ============================================
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal-on-scroll.revealed {
      opacity: 1;
      transform: translateY(0);
    }
    
    .header {
      transition: transform 0.3s ease, background 0.3s ease, backdrop-filter 0.3s ease;
    }
    
    .header.scrolled {
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    .header.hide {
      transform: translateY(-100%);
    }
    
    .cart-count {
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .add-to-cart {
      transition: all 0.2s ease;
    }
    
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    body.menu-open {
      overflow: hidden;
    }
    
    [dir="rtl"] .reveal-on-scroll {
      transform: translateY(30px) translateX(0);
    }
    
    @media (max-width: 768px) {
      .reveal-on-scroll {
        transform: translateY(20px);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // ============================================
  // PRELOADER REMOVAL WITH FADE OUT
  // ============================================
  const preloader = document.querySelector(".preloader");
  if (preloader) {
    preloader.style.transition = "opacity 0.5s ease";
    preloader.style.opacity = "0";
    setTimeout(() => preloader.remove(), 500);
  }

  // ============================================
  // UPDATE COPYRIGHT YEAR
  // ============================================
  const yearSpan = document.querySelector(".footer-bottom p");
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = yearSpan.innerHTML.replace(/2024|2025|2026/, currentYear);
  }

  // ============================================
  // PAGE LOAD ANIMATION
  // ============================================
  body.style.opacity = "0";
  body.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    body.style.opacity = "1";
  }, 100);

  console.log("✅ PixelPort initialized!");
});
