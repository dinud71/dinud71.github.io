// =========================
// Portfolio & UI Scripts
// =========================
console.log("Portfolio JS loaded");

// =========================
// Change header background on scroll
// =========================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// =========================
// Adjust banner if main heading wraps
// =========================
(() => {
  const heading = document.querySelector('.banner-text');
  const bannerContent = document.querySelector('.banner-content');
  if (!heading || !bannerContent) return;

  const getLineCount = el => {
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    return Math.round(el.scrollHeight / lineHeight);
  };

  const initialLines = getLineCount(heading);

  const checkWrap = () => {
    bannerContent.classList.toggle('shift-up', getLineCount(heading) > initialLines);
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  window.addEventListener('resize', debounce(checkWrap, 120));
  window.addEventListener('load', () => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(checkWrap).catch(checkWrap);
    } else {
      checkWrap();
    }
  });
})();

// =========================
// Portfolio Overlay Script
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const projectData = {
    "14_Botanique Hotel": { base: "Botanique_Hotel_", count: 43, ext: "webp" },
    "15_SOARÊ - BAR & RESTAURANT": { base: "SOARÊ", count: 17, ext: "webp" },
    "16_Hôtel Belleval": { base: "Belleval", count: 24, ext: "webp" },
    "17_Chabino Cottage Branding": { base: "Chabino", count: 22, ext: "webp" },
    "18_Henson Hotel": { base: "Henson Hotel", count: 33, ext: "webp" },
    "19_Hammock Park Residences": { base: "Hammock Park", count: 5, ext: "webp" },
    "20_Berkeley, Dubai Hills - Brand Identity": { base: "Berkeley, Dubai Hills", count: 6, ext: "webp" },
    "21_Montaña. Ski resort apart-hotel": { base: "Montaña.", count: 10, ext: "webp" },
    "22_Stayery": { base: "Stayery", count: 22, ext: "webp" },
    "23_Al Hudaida Hotel": { base: "Al Hudaida", count: 17, ext: "webp" },
    "24_Hotel Emporium": { base: "Hotel Emporium", count: 9, ext: "webp" },
    "25_Bob's Bar": { base: "Bob's Bar", count: 32, ext: "webp" },
    "26_Hôtel Cargo": { base: "Hôtel Cargo", count: 31, ext: "webp" },
    "27_El Faro Resort": { base: "El Faro Resort", count: 12, ext: "webp" },
    "28_PALAUM - luxury villa": { base: "PALAUM", count: 13, ext: "webp" },
  };

  // 1️⃣ Create overlay container
  const overlay = document.createElement("div");
  overlay.classList.add("portfolio-overlay");
  overlay.style.cssText = `
    position: fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.9);
    display:none; flex;
    justify-content:center;
    z-index:1000;
    overflow-y:auto;
    padding: 50px 0;
  `;
  const overlayContent = document.createElement("div");
  overlayContent.classList.add("overlay-content");
  overlayContent.style.cssText = `
    max-width:1500px;
    width:100%;
    margin:0 auto;
    display:flex;
    flex-direction:column;
    gap:30px;
  `;
  overlay.appendChild(overlayContent);
  document.body.appendChild(overlay);

// ===== Mobile close button for portfolio overlay =====
const mobileCloseBtn = document.createElement("button");
mobileCloseBtn.classList.add("mobile-close-btn");
mobileCloseBtn.innerHTML = '<img src="Images/MenuClose.svg" alt="Close">';
mobileCloseBtn.style.cssText = `
  display:none;
  position:absolute;
  top:12px;
  right:12px;
  background:transparent;
  border:none;
  padding:6px;
  cursor:pointer;
  z-index:1001;
`;
overlay.appendChild(mobileCloseBtn); // append to overlay, NOT overlayContent

// Show only on mobile
if (window.innerWidth <= 768) {
  mobileCloseBtn.style.display = "block";
}

// Close overlay on button click
mobileCloseBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  document.body.style.overflow = "";
});

  // 2️⃣ Open overlay
  function openOverlay(projectName) {
    const project = projectData[projectName];
    if (!project) return;

    overlayContent.innerHTML = "";
    for (let i = 1; i <= project.count; i++) {
      const img = document.createElement("img");
      const fileName = `${project.base} (${i}).${project.ext}`;
      const path = `Images/${projectName}/${fileName}`;
      img.src = encodeURI(path);
      img.alt = `${projectName} image ${i}`;
      img.style.width = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";
      overlayContent.appendChild(img);
    }

    overlay.style.display = "flex";
    document.body.style.overflow = "hidden"; // freeze background scroll
  }

  // 3️⃣ Close overlay clicking outside
  overlay.addEventListener("click", (e) => {
    const rect = overlayContent.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right) {
      overlay.style.display = "none";
      document.body.style.overflow = ""; // restore scroll
    }
  });

  // 4️⃣ Close overlay on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  });

  // 5️⃣ Attach click events to thumbnails
  document.querySelectorAll(".portfolio-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const projectName = thumb.getAttribute("data-project");
      console.log("Clicked project:", projectName);
      openOverlay(projectName);
    });
  });
});

// ============== Menu overlay toggle ==============
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuToggle');
  const overlay = document.getElementById('overlayMenu');
  const closeBtn = document.getElementById('overlayClose');

  if (!menuBtn || !overlay) return;

  // Toggle overlay open/close
  menuBtn.addEventListener('click', () => {
    const isActive = overlay.classList.toggle('active');
    overlay.setAttribute('aria-hidden', (!isActive).toString());
    menuBtn.setAttribute('aria-expanded', isActive.toString());
    document.body.classList.toggle('overlay-active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overlay-active');
      document.body.style.overflow = '';
    });
  }

  // Click outside overlay content (clicking the backdrop) closes it
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overlay-active');
      document.body.style.overflow = '';
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overlay-active');
      document.body.style.overflow = '';
    }
  });

  // Optional: close when any overlay link is clicked
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overlay-active');
      document.body.style.overflow = '';
    });
  });
});
