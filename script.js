// Helper to format date in IST: DD/MM/YYYY hh:mm AM/PM IST
function formatToIST(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return `${dateStr} ${timeStr} IST`;
  } catch (e) {
    return isoString;
  }
}

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const cameraBtn = document.querySelector(".camera-icon");
  const micBtn = document.querySelector(".mic-icon");
  const searchBtn = document.querySelector(".search-icon");

  // Search button functionality
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    performSearch(query);
  });

  // Enter key to search
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });

  // Reset search when input is erased/cleared
  searchInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      resetSearch();
    }
  });

  // Helper functions for search
  function performSearch(query) {
    if (!query) {
      resetSearch();
      return;
    }

    // Check if not on index page - if so, redirect to index.html with query
    const isIndexPage = window.location.pathname === "/" || 
                        window.location.pathname.endsWith("/index.html") || 
                        window.location.pathname.endsWith("/index") ||
                        window.location.pathname === "";
    if (!isIndexPage) {
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      return;
    }

    // On index.html: filter product cards & arrival cards
    const productCards = document.querySelectorAll(".product-card");
    const arrivalCards = document.querySelectorAll(".arrival-banner-card");
    let matchCount = 0;

    const term = query.toLowerCase().trim();
    const termSingular = term.endsWith('s') && term.length > 3 ? term.slice(0, -1) : term;

    // Filter product cards (featured products & schemes)
    productCards.forEach(card => {
      const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
      const category = card.querySelector(".category") ? card.querySelector(".category").textContent.toLowerCase() : "";
      const desc = card.querySelector(".description") ? card.querySelector(".description").textContent.toLowerCase() : "";
      const details = card.querySelector(".scheme-details") ? card.querySelector(".scheme-details").textContent.toLowerCase() : "";

      if (title.includes(term) || title.includes(termSingular) || 
          category.includes(term) || category.includes(termSingular) || 
          desc.includes(term) || desc.includes(termSingular) || 
          details.includes(term) || details.includes(termSingular)) {
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        matchCount++;
      } else {
        card.style.display = "none";
        card.style.opacity = "0";
      }
    });

    // Filter arrival cards (new arrivals)
    arrivalCards.forEach(card => {
      const title = card.querySelector("h3") ? card.querySelector("h3").textContent.toLowerCase() : "";
      const img = card.querySelector("img");
      const imgAlt = img ? img.alt.toLowerCase() : "";
      const imgSrc = img ? img.getAttribute("src").toLowerCase() : "";

      if (title.includes(term) || title.includes(termSingular) || 
          imgAlt.includes(term) || imgAlt.includes(termSingular) || 
          imgSrc.includes(term) || imgSrc.includes(termSingular)) {
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        matchCount++;
      } else {
        card.style.display = "none";
        card.style.opacity = "0";
      }
    });

    // Show/hide search banner
    let banner = document.getElementById("searchResultsBanner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "searchResultsBanner";
      banner.className = "search-results-banner";
      
      const grid = document.querySelector(".products-grid");
      if (grid) {
        grid.parentNode.insertBefore(banner, grid);
      }
    }
    
    banner.innerHTML = `Showing results for "<strong>${escapeHtml(query)}</strong>" (${matchCount} found) <button class="clear-search-btn" id="clearSearchBtn">&times; Clear</button>`;
    banner.style.display = "flex";

    document.getElementById("clearSearchBtn").addEventListener("click", resetSearch);

    // Scroll to products section smoothly
    const productsSection = document.querySelector(".featured-products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function resetSearch() {
    searchInput.value = "";
    
    if (!window.location.pathname.includes("home.html")) {
      const productCards = document.querySelectorAll(".product-card");
      productCards.forEach(card => {
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      });

      const arrivalCards = document.querySelectorAll(".arrival-banner-card");
      arrivalCards.forEach(card => {
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
      });

      const banner = document.getElementById("searchResultsBanner");
      if (banner) {
        banner.style.display = "none";
      }
    }
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // Parse URL search parameters on index.html load
  if (!window.location.pathname.includes("home.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      searchInput.value = searchQuery;
      setTimeout(() => {
        performSearch(searchQuery);
        // Clear the search query parameter from URL so it doesn't run again on page refresh
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }, 300);
    }
  }

  // Camera icon functionality
  let cameraStream = null;
  cameraBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openCameraModal();
  });

  function openCameraModal() {
    let overlay = document.getElementById("cameraModalOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "cameraModalOverlay";
      overlay.className = "camera-modal-overlay";
      overlay.innerHTML = `
        <div class="camera-modal">
          <div class="camera-modal-header">
            <h3>Visual Search</h3>
            <button class="camera-close-btn" id="cameraCloseBtn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="camera-viewport-container">
            <video class="camera-video" id="cameraVideo" autoplay playsinline></video>
            <img class="camera-preview-img" id="cameraPreviewImg" alt="Captured search item">
            <div class="camera-target-bracket" id="cameraTargetBracket"></div>
            <div class="camera-flash" id="cameraFlash"></div>
            <canvas class="camera-canvas" id="cameraCanvas"></canvas>
          </div>
          <div class="camera-modal-footer" id="cameraModalFooter">
            <button class="camera-action-btn btn-shutter" id="cameraShutterBtn" title="Take Photo">
              <i class="fas fa-camera"></i>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById("cameraCloseBtn").addEventListener("click", closeCameraModal);
      document.getElementById("cameraShutterBtn").addEventListener("click", capturePhoto);
    }

    const video = document.getElementById("cameraVideo");
    const previewImg = document.getElementById("cameraPreviewImg");
    const bracket = document.getElementById("cameraTargetBracket");
    const footer = document.getElementById("cameraModalFooter");

    // Reset overlay layout in case error state had altered it
    const viewport = overlay.querySelector(".camera-viewport-container");
    if (viewport.querySelector(".camera-error-msg")) {
      viewport.innerHTML = `
        <video class="camera-video" id="cameraVideo" autoplay playsinline></video>
        <img class="camera-preview-img" id="cameraPreviewImg" alt="Captured search item">
        <div class="camera-target-bracket" id="cameraTargetBracket"></div>
        <div class="camera-flash" id="cameraFlash"></div>
        <canvas class="camera-canvas" id="cameraCanvas"></canvas>
      `;
    }

    // Reset view state
    document.getElementById("cameraPreviewImg").style.display = "none";
    document.getElementById("cameraVideo").style.display = "block";
    document.getElementById("cameraTargetBracket").style.display = "block";
    footer.innerHTML = `
      <button class="camera-action-btn btn-shutter" id="cameraShutterBtn" title="Take Photo">
        <i class="fas fa-camera"></i>
      </button>
    `;
    document.getElementById("cameraShutterBtn").addEventListener("click", capturePhoto);

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(s => {
        cameraStream = s;
        document.getElementById("cameraVideo").srcObject = cameraStream;
        overlay.classList.add("active");
      })
      .catch(err => {
        console.error("Camera access error:", err);
        overlay.querySelector(".camera-viewport-container").innerHTML = `
          <div class="camera-error-msg">
            <i class="fas fa-exclamation-triangle" style="font-size: 40px; margin-bottom: 15px;"></i>
            <p>Camera access denied or unavailable.</p>
            <p style="font-size: 13px; margin-top: 10px; opacity: 0.8;">Please ensure camera permissions are enabled in your browser settings.</p>
          </div>
        `;
        overlay.classList.add("active");
        footer.innerHTML = `
          <button class="camera-action-btn btn-retake" id="cameraCloseErrorBtn">Close</button>
        `;
        document.getElementById("cameraCloseErrorBtn").addEventListener("click", closeCameraModal);
      });
  }

  function capturePhoto() {
    const video = document.getElementById("cameraVideo");
    const canvas = document.getElementById("cameraCanvas");
    const previewImg = document.getElementById("cameraPreviewImg");
    const bracket = document.getElementById("cameraTargetBracket");
    const flash = document.getElementById("cameraFlash");
    const footer = document.getElementById("cameraModalFooter");

    flash.classList.add("flash-active");
    setTimeout(() => flash.classList.remove("flash-active"), 300);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    previewImg.src = dataUrl;
    previewImg.style.display = "block";
    video.style.display = "none";
    bracket.style.display = "none";

    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    footer.innerHTML = `
      <button class="camera-action-btn btn-retake" id="cameraRetakeBtn">
        <i class="fas fa-redo"></i> Retake
      </button>
      <button class="camera-action-btn btn-use-photo" id="cameraUseBtn">
        <i class="fas fa-search"></i> Search Design
      </button>
    `;

    document.getElementById("cameraRetakeBtn").addEventListener("click", openCameraModal);
    document.getElementById("cameraUseBtn").addEventListener("click", function() {
      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        searchInput.value = "Selected visual design search pattern";
        const searchBtn = document.querySelector(".search-icon");
        if (searchBtn) searchBtn.click();
      }
      closeCameraModal();
      alert("Simulating Visual Search: Analyzing design patterns from captured photo to find matching jewelry collections.");
    });
  }

  function closeCameraModal() {
    const overlay = document.getElementById("cameraModalOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  }

  // Microphone voice search functionality
  let recognition = null;
  let isListening = false;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  micBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported by your current browser. Please try Google Chrome or Safari.");
      return;
    }
    openVoiceSearchModal();
  });

  function openVoiceSearchModal() {
    let overlay = document.getElementById("micModalOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "micModalOverlay";
      overlay.className = "mic-modal-overlay";
      overlay.innerHTML = `
        <div class="mic-modal">
          <button class="mic-close-btn" id="micCloseBtn">
            <i class="fas fa-times"></i>
          </button>
          <div class="mic-pulse-container">
            <div class="mic-pulse-ring"></div>
            <div class="mic-pulse-ring"></div>
            <div class="mic-icon-wrapper">
              <i class="fas fa-microphone"></i>
            </div>
          </div>
          <div class="mic-status" id="micStatus">Listening...</div>
          <div class="mic-hint" id="micHint">Try saying "Gold Necklace" or "Bridal Set"</div>
          <div class="mic-transcript" id="micTranscript"></div>
          <div class="audio-waves" id="audioWaves">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      document.getElementById("micCloseBtn").addEventListener("click", closeVoiceSearchModal);
    }

    const transcriptDiv = document.getElementById("micTranscript");
    const statusDiv = document.getElementById("micStatus");
    const hintDiv = document.getElementById("micHint");
    const waves = document.getElementById("audioWaves");

    // Reset UI
    transcriptDiv.textContent = "";
    statusDiv.textContent = "Listening...";
    hintDiv.textContent = 'Try saying "Gold Necklace" or "Bridal Set"';
    waves.style.display = "flex";
    overlay.classList.add("active");

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN"; // Optimise for Indian English accent

    recognition.onstart = function() {
      isListening = true;
      console.log("Voice recognition started");
    };

    recognition.onresult = function(event) {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeTranscript = finalTranscript || interimTranscript;
      transcriptDiv.textContent = activeTranscript;

      if (finalTranscript) {
        statusDiv.textContent = "Searching...";
        waves.style.display = "none";
        
        setTimeout(() => {
          searchInput.value = finalTranscript.trim();
          closeVoiceSearchModal();
          searchBtn.click();
        }, 800);
      }
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error:", event.error);
      statusDiv.textContent = "Oops! Try again";
      waves.style.display = "none";
      if (event.error === "not-allowed") {
        hintDiv.innerHTML = '<span class="mic-error-msg">Microphone permission denied.<br>Please allow access in your settings.</span>';
      } else {
        hintDiv.innerHTML = `<span class="mic-error-msg">Error: ${event.error}</span>`;
      }
    };

    recognition.onend = function() {
      isListening = false;
      console.log("Voice recognition ended");
      if (statusDiv.textContent === "Listening...") {
        statusDiv.textContent = "Tap close to cancel";
        waves.style.display = "none";
      }
    };

    recognition.start();
  }

  function closeVoiceSearchModal() {
    const overlay = document.getElementById("micModalOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
    if (recognition && isListening) {
      recognition.abort();
    }
    isListening = false;
  }

  // Navigation menu items
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // If the link has a mega menu dropdown, do not trigger search filtering
      if (this.closest(".has-mega-menu")) {
        return;
      }

      const category = this.querySelector("span").textContent.trim();
      console.log("Selected category:", category);
      
      if (category.toLowerCase() === "all jewellery") {
        // Let standard browser navigation navigate to /all-jewellery
        return;
      }
      
      e.preventDefault();
      searchInput.value = category;
      performSearch(category);
    });
  });

  // Product cart functionality
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const productCard = this.closest(".product-card");
      const productName =
        productCard.querySelector(".product-info h3").textContent;
      const productPrice = productCard.querySelector(".price").textContent;

      // Add to cart notification
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.backgroundColor = "#4caf50";

      console.log("Added to cart:", productName, productPrice);

      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        this.style.backgroundColor = "var(--secondary-color)";
      }, 2000);
    });
  });

  // Product card click for detailed view
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.closest(".add-to-cart")) {
        const productName = this.querySelector(".product-info h3").textContent;
        console.log("Viewing product:", productName);
        // Add product detail page navigation here
      }
    });
  });

  // Smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Profile dropdown menu toggle functionality
  const avatarBtn = document.querySelector(".user-avatar-btn");
  const dropdownMenu = document.querySelector(".profile-dropdown-menu");

  if (avatarBtn && dropdownMenu) {
    avatarBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function () {
      dropdownMenu.classList.remove("show");
    });
  }

  // Mega Dropdown Menu Setup
  function setupMegaDropdown(btnId, dropdownId) {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);

    if (!btn || !dropdown) return;

    let hideTimeout;

    function showDropdown() {
      clearTimeout(hideTimeout);
      dropdown.classList.add("show");
      btn.classList.add("active-menu");
    }

    function hideDropdown() {
      hideTimeout = setTimeout(() => {
        dropdown.classList.remove("show");
        btn.classList.remove("active-menu");
      }, 200);
    }

    // Hover events on the navbar button
    btn.addEventListener("mouseenter", showDropdown);
    btn.addEventListener("mouseleave", hideDropdown);

    // Hover events on the Dropdown panel itself
    dropdown.addEventListener("mouseenter", showDropdown);
    dropdown.addEventListener("mouseleave", hideDropdown);

    // Click/Touch toggle (for mobile/tablet and click fallback)
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const isShown = dropdown.classList.contains("show");
      if (isShown) {
        dropdown.classList.remove("show");
        btn.classList.remove("active-menu");
      } else {
        showDropdown();
      }
    });

    // Sidebar Tab Switching Setup
    const sidebarItems = dropdown.querySelectorAll(".sidebar-item");
    const gridPanels = dropdown.querySelectorAll(".mega-grid");

    function switchTab(targetItem) {
      sidebarItems.forEach(item => item.classList.remove("active"));
      targetItem.classList.add("active");

      gridPanels.forEach(panel => panel.classList.remove("active-grid"));

      const tabName = targetItem.getAttribute("data-tab");
      const targetPanel = dropdown.querySelector(`#tab-${btnId.replace('MegaMenuBtn', '')}-${tabName}`);
      if (targetPanel) {
        targetPanel.classList.add("active-grid");
      }
    }

    sidebarItems.forEach(item => {
      // Switch tab on hover for desktop
      item.addEventListener("mouseenter", function () {
        switchTab(this);
      });

      // Switch tab on click/touch for mobile/fallback
      item.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent closing dropdown
        switchTab(this);
      });
    });
  }

  // Setup Gold, Diamond, Earrings, Rings, Daily Wear, Gemstone & Wedding Mega Dropdowns
  setupMegaDropdown("alljewelleryMegaMenuBtn", "alljewelleryMegaDropdown");
  setupMegaDropdown("goldMegaMenuBtn", "goldMegaDropdown");
  setupMegaDropdown("diamondMegaMenuBtn", "diamondMegaDropdown");
  setupMegaDropdown("earringsMegaMenuBtn", "earringsMegaDropdown");
  setupMegaDropdown("ringsMegaMenuBtn", "ringsMegaDropdown");
  setupMegaDropdown("dailywearMegaMenuBtn", "dailywearMegaDropdown");
  setupMegaDropdown("gemstoneMegaMenuBtn", "gemstoneMegaDropdown");
  setupMegaDropdown("weddingMegaMenuBtn", "weddingMegaDropdown");

  // Close when clicking anywhere else on screen
  document.addEventListener("click", function (e) {
    const alljewelleryBtn = document.getElementById("alljewelleryMegaMenuBtn");
    const alljewelleryDropdown = document.getElementById("alljewelleryMegaDropdown");
    const goldBtn = document.getElementById("goldMegaMenuBtn");
    const goldDropdown = document.getElementById("goldMegaDropdown");
    const diamondBtn = document.getElementById("diamondMegaMenuBtn");
    const diamondDropdown = document.getElementById("diamondMegaDropdown");
    const earringsBtn = document.getElementById("earringsMegaMenuBtn");
    const earringsDropdown = document.getElementById("earringsMegaDropdown");
    const ringsBtn = document.getElementById("ringsMegaMenuBtn");
    const ringsDropdown = document.getElementById("ringsMegaDropdown");
    const dailywearBtn = document.getElementById("dailywearMegaMenuBtn");
    const dailywearDropdown = document.getElementById("dailywearMegaDropdown");
    const gemstoneBtn = document.getElementById("gemstoneMegaMenuBtn");
    const gemstoneDropdown = document.getElementById("gemstoneMegaDropdown");
    const weddingBtn = document.getElementById("weddingMegaMenuBtn");
    const weddingDropdown = document.getElementById("weddingMegaDropdown");

    if (alljewelleryDropdown && alljewelleryDropdown.classList.contains("show") && !alljewelleryDropdown.contains(e.target) && e.target !== alljewelleryBtn) {
      alljewelleryDropdown.classList.remove("show");
      if (alljewelleryBtn) alljewelleryBtn.classList.remove("active-menu");
    }
    if (goldDropdown && goldDropdown.classList.contains("show") && !goldDropdown.contains(e.target) && e.target !== goldBtn) {
      goldDropdown.classList.remove("show");
      if (goldBtn) goldBtn.classList.remove("active-menu");
    }
    if (diamondDropdown && diamondDropdown.classList.contains("show") && !diamondDropdown.contains(e.target) && e.target !== diamondBtn) {
      diamondDropdown.classList.remove("show");
      if (diamondBtn) diamondBtn.classList.remove("active-menu");
    }
    if (earringsDropdown && earringsDropdown.classList.contains("show") && !earringsDropdown.contains(e.target) && e.target !== earringsBtn) {
      earringsDropdown.classList.remove("show");
      if (earringsBtn) earringsBtn.classList.remove("active-menu");
    }
    if (ringsDropdown && ringsDropdown.classList.contains("show") && !ringsDropdown.contains(e.target) && e.target !== ringsBtn) {
      ringsDropdown.classList.remove("show");
      if (ringsBtn) ringsBtn.classList.remove("active-menu");
    }
    if (dailywearDropdown && dailywearDropdown.classList.contains("show") && !dailywearDropdown.contains(e.target) && e.target !== dailywearBtn) {
      dailywearDropdown.classList.remove("show");
      if (dailywearBtn) dailywearBtn.classList.remove("active-menu");
    }
    if (gemstoneDropdown && gemstoneDropdown.classList.contains("show") && !gemstoneDropdown.contains(e.target) && e.target !== gemstoneBtn) {
      gemstoneDropdown.classList.remove("show");
      if (gemstoneBtn) gemstoneBtn.classList.remove("active-menu");
    }
    if (weddingDropdown && weddingDropdown.classList.contains("show") && !weddingDropdown.contains(e.target) && e.target !== weddingBtn) {
      weddingDropdown.classList.remove("show");
      if (weddingBtn) weddingBtn.classList.remove("active-menu");
    }
  });

  // Cart Icon redirect to Checkout
  const cartIcon = document.querySelector('img[alt="Cart"]');
  if (cartIcon) {
    cartIcon.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "checkout.html";
    });
  }

  function openCartModal() {
    let cartModal = document.getElementById("cartModal");
    if (!cartModal) {
      cartModal = document.createElement("div");
      cartModal.id = "cartModal";
      cartModal.className = "cart-modal-overlay";
      cartModal.innerHTML = `
        <div class="cart-modal-content">
          <button class="cart-modal-close" id="closeCartModalBtn">&times;</button>
          <div class="cart-empty-container">
            <div class="cart-empty-icon-circle">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Bag Handle -->
                <path d="M35 32 C35 18, 65 18, 65 32" stroke="#7a7a7a" stroke-width="2.5" fill="none"/>
                <!-- Bag Body -->
                <path d="M28 35 L72 35 L76 78 L24 78 Z" stroke="#7a7a7a" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
                <!-- Eyes -->
                <circle cx="43" cy="55" r="2.5" fill="#7a7a7a"/>
                <circle cx="57" cy="55" r="2.5" fill="#7a7a7a"/>
                <!-- Mouth -->
                <line x1="43" y1="65" x2="57" y2="65" stroke="#7a7a7a" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <h2 class="cart-empty-title">YOUR CART IS EMPTY</h2>
            <div class="cart-empty-actions">
              <button class="cart-btn-continue" id="continueShoppingBtn">Continue Shopping</button>
              <a href="login" class="cart-btn-login">Login To View Your Cart</a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(cartModal);

      // Event listener to close modal
      const closeBtn = cartModal.querySelector("#closeCartModalBtn");
      closeBtn.addEventListener("click", closeCartModal);

      const continueBtn = cartModal.querySelector("#continueShoppingBtn");
      continueBtn.addEventListener("click", closeCartModal);

      // Close on background click
      cartModal.addEventListener("click", function (evt) {
        if (evt.target === cartModal) {
          closeCartModal();
        }
      });
    }

    cartModal.classList.add("show");
    document.body.classList.add("modal-open");
  }

  function closeCartModal() {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.classList.remove("show");
    }
    document.body.classList.remove("modal-open");
  }

});

// Banner Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function goToSlide(n) {
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function changeSlide(dir) {
  goToSlide(currentSlide + dir);
}

// Auto slide every 3 seconds
setInterval(() => changeSlide(1), 3000);

// Stories 3D Coverflow Carousel
window.activeStoryIndex = 2; // start with center item (GIA & IGI Diamonds) active

window.updateStories = function() {
  const cards = document.querySelectorAll('.story-card');
  if (!cards.length) return;
  cards.forEach((card, index) => {
    card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
    
    const diff = index - window.activeStoryIndex;
    
    if (diff === 0) {
      card.classList.add('active');
    } else if (diff === -1) {
      card.classList.add('prev');
    } else if (diff === 1) {
      card.classList.add('next');
    } else if (diff === -2) {
      card.classList.add('far-prev');
    } else if (diff === 2) {
      card.classList.add('far-next');
    } else {
      card.classList.add('hidden');
    }
  });
}

window.activeStory = function(index) {
  window.activeStoryIndex = index;
  window.updateStories();
}

window.shiftStories = function(dir) {
  const cards = document.querySelectorAll('.story-card');
  if (!cards.length) return;
  window.activeStoryIndex = (window.activeStoryIndex + dir + cards.length) % cards.length;
  window.updateStories();
}

document.addEventListener("DOMContentLoaded", () => {
  window.updateStories();
  initSwarnalayaLoginModal();
});

// ==========================================
// SWARNALAYA PREMIUM LOGIN MODAL CONTROLLER
// ==========================================
function initSwarnalayaLoginModal() {
  // 1. Check if user is already logged in
  if (localStorage.getItem("swarnalaya_auth_user")) {
    return;
  }

  // 2. Start 1-minute timer to show the modal
  setTimeout(() => {
    // Re-check state just in case user logged in during the 1 minute
    if (localStorage.getItem("swarnalaya_auth_user")) {
      return;
    }

    injectAndShowModal();
  }, 60000); // 1 minute delay
}

function injectAndShowModal() {
  // 3. Inject Modal HTML if it doesn't exist
  let overlay = document.getElementById("swLoginModalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "swLoginModalOverlay";
    overlay.className = "sw-login-modal-overlay";
    
    overlay.innerHTML = `
      <div class="sw-login-modal-container">
        <button class="sw-modal-close-btn" id="swModalCloseBtn" title="Close window">&times;</button>
        
        <!-- Left Banner: Marketing & Privileges -->
        <div class="sw-login-modal-left">
          <div class="sw-sparkle sw-sparkle-1">✦</div>
          <div class="sw-sparkle sw-sparkle-2">✦</div>
          <div class="sw-sparkle sw-sparkle-3">✦</div>
          <div class="sw-sparkle sw-sparkle-4">✦</div>
          <div class="sw-sparkle sw-sparkle-5">✦</div>
          
          <div class="sw-gift-circle">
            <svg viewBox="0 0 100 100" class="sw-gift-svg-box">
              <path d="M10,25 Q15,25 15,20 Q15,25 20,25 Q15,25 15,30 Q15,25 10,25" fill="#dfba6b"/>
              <path d="M85,15 Q90,15 90,10 Q90,15 95,15 Q90,15 90,20 Q90,15 85,15" fill="#dfba6b"/>
              <path d="M80,80 Q83,80 83,77 Q83,80 86,80 Q83,80 83,83 Q83,80 80,80" fill="#dfba6b"/>
              <ellipse cx="50" cy="85" rx="30" ry="6" fill="rgba(223, 186, 107, 0.2)" />
              <rect x="25" y="45" width="50" height="36" rx="3" fill="#5c1c1c" stroke="#dfba6b" stroke-width="1.5" />
              <rect x="21" y="36" width="58" height="10" rx="2" fill="#752929" stroke="#dfba6b" stroke-width="1.5" />
              <rect x="46" y="36" width="8" height="45" fill="#dfba6b" />
              <path d="M48,36 C42,20 28,24 46,36 Z" fill="#dfba6b" stroke="#bc9a50" stroke-width="0.5"/>
              <path d="M52,36 C58,20 72,24 54,36 Z" fill="#dfba6b" stroke="#bc9a50" stroke-width="0.5"/>
              <circle cx="50" cy="36" r="4.5" fill="#dfba6b" />
            </svg>
          </div>
          
          <div class="sw-offer-badge-container">
            <div class="sw-offer-badge">
              <div class="sw-offer-badge-title">On your first order get</div>
              <div class="sw-offer-badge-discount">₹500 off</div>
            </div>
          </div>
          
          <div style="width: 100%;">
            <div class="sw-benefits-title">And other benefits</div>
            <div class="sw-benefits-footer">
              <div class="sw-benefit-item">
                <div class="sw-benefit-icon-circle coins">
                  <i class="fas fa-coins"></i>
                </div>
                <span>Swarnalaya Coins</span>
              </div>
              <div class="sw-benefit-item">
                <div class="sw-benefit-icon-circle wishlist">
                  <i class="fas fa-heart"></i>
                </div>
                <span>Unlock Wishlist</span>
              </div>
              <div class="sw-benefit-item">
                <div class="sw-benefit-icon-circle personal">
                  <i class="fas fa-gem"></i>
                </div>
                <span>Personalized Shop</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Banner: Form & OTP fields -->
        <div class="sw-login-modal-right">
          <div id="swLoginContentBox" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            
            <div class="sw-login-header">
              <h2 id="swModalTitle">Welcome to Swarnalaya!</h2>
              <p id="swModalSub">Sign in to unlock your exclusive membership rewards and track savings schemes.</p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center; flex-grow: 1; padding: 20px 0;">
              <div style="font-size: 60px; color: #dfba6b; text-shadow: 0 4px 10px rgba(223, 186, 107, 0.2);"><i class="fas fa-gem"></i></div>
              <p style="text-align: center; color: #555; font-size: 15px; line-height: 1.5; padding: 0 20px;">Access your customized dashboard, wishlist sync, and gold rate updates in one tap.</p>
            </div>

            <!-- Redirect Button -->
            <div style="width: 100%;">
              <a href="login.html" class="sw-verify-otp-btn" id="swSubmitBtn" style="width: 100%; border-radius: 20px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; text-align: center; height: 42px; line-height: 42px; background-color: #1a5f4a; color: #fff; box-shadow: 0 4px 12px rgba(26, 95, 74, 0.2);">
                <span>Sign In with Mobile OTP</span>
              </a>
            </div>

            <div class="sw-terms-disclaimer" style="margin-top: 15px;">
              By continuing, I agree to <a href="#">Terms of Use</a> & <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    setupModalEvents(overlay);
  }
  
  // Show the modal
  setTimeout(() => {
    overlay.classList.add("active");
  }, 100);
}

function setupModalEvents(overlay) {
  const closeBtn = document.getElementById("swModalCloseBtn");

  function closeModal() {
    overlay.classList.remove("active");
    setTimeout(() => {
      if (!localStorage.getItem("swarnalaya_auth_user")) {
        setTimeout(() => {
          if (!localStorage.getItem("swarnalaya_auth_user")) {
            overlay.classList.add("active");
          }
        }, 60000);
      }
    }, 400);
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
}

  // ==========================================
  // CHENNAI GOLD RATE TICKER CONTROLLER (TOP & NAVBAR)
  // ==========================================
  (function() {
    // 1. Inject Top Scrolling Ticker Bar
    function injectTopTicker() {
      if (document.getElementById("topLiveRatesTicker")) return;
      const ticker = document.createElement("div");
      ticker.id = "topLiveRatesTicker";
      ticker.className = "top-scrolling-ticker";
      ticker.innerHTML = `
        <div class="ticker-content-wrapper">
          <div class="ticker-items" id="topTickerItems1">Loading live Chennai rates...</div>
          <div class="ticker-items" id="topTickerItems2">Loading live Chennai rates...</div>
        </div>
      `;
      document.body.insertBefore(ticker, document.body.firstChild);
    }
    
    // 2. Format a single item string for the top scrolling ticker
    function formatTopItem(label, priceVal, pctChange, direction) {
      const arrow = direction === "up" ? "▲" : direction === "down" ? "▼" : "■";
      const dirClass = direction === "up" ? "rate-up" : direction === "down" ? "rate-down" : "rate-flat";
      const pctStr = pctChange !== 0 ? `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(2)}%` : '0.00%';
      return `
        <span class="ticker-item">
          <span class="ticker-item-label">${label}</span>
          <span class="ticker-item-val">₹${priceVal.toLocaleString('en-IN')}/g</span>
          <span class="ticker-item-change ${dirClass}">${arrow} ${pctStr}</span>
        </span>
      `;
    }

    // 3. Format Date/Time nicely for "Last Updated" display
    function formatLastUpdated(isoString) {
      return formatToIST(isoString);
    }

    // 4. Update the content of the top ticker
    function updateTopTicker(data) {
      const t1 = document.getElementById("topTickerItems1");
      const t2 = document.getElementById("topTickerItems2");
      if (!t1 || !t2) return;

      const updatedStr = formatLastUpdated(data.lastUpdated);
      const content = `
        <span class="ticker-title"><i class="fas fa-bolt"></i> Chennai Live Rates</span>
        ${formatTopItem("Gold 24K (999)", data.gold24K.price, data.gold24K.change, data.gold24K.direction)}
        ${formatTopItem("Gold 22K (916)", data.gold22K.price, data.gold22K.change, data.gold22K.direction)}
        ${formatTopItem("Gold 18K (750)", data.gold18K.price, data.gold18K.change, data.gold18K.direction)}
        ${formatTopItem("Silver (Pure)", data.silver.price, data.silver.change, data.silver.direction)}
        <span class="ticker-timestamp"><i class="far fa-clock"></i> Last Updated: ${updatedStr}</span>
      `;
      
      t1.innerHTML = content;
      t2.innerHTML = content;
    }

    // 5. Navbar Ticker cycling setup (uses same data)
    const tickerTextElement = document.getElementById("tickerText");
    let currentRateIndex = 0;
    let rateItems = [];
    let cycleIntervalId = null;

    function rotateNavbarTicker() {
      if (!tickerTextElement || rateItems.length === 0) return;
      
      const item = rateItems[currentRateIndex];
      currentRateIndex = (currentRateIndex + 1) % rateItems.length;

      tickerTextElement.classList.add("fade-out");
      setTimeout(() => {
        tickerTextElement.innerHTML = `
          <div class="ticker-label">${item.label}</div>
          <div class="ticker-value">${item.value}</div>
        `;
        tickerTextElement.classList.remove("fade-out");
        tickerTextElement.classList.add("fade-in");
        tickerTextElement.offsetWidth; // Force reflow
        tickerTextElement.classList.remove("fade-in");
      }, 350);
    }

    function updateNavbarTickerItems(data) {
      if (!tickerTextElement) return;
      const arrow24 = data.gold24K.direction === "up" ? " ▲" : data.gold24K.direction === "down" ? " ▼" : "";
      const arrow22 = data.gold22K.direction === "up" ? " ▲" : data.gold22K.direction === "down" ? " ▼" : "";
      const arrow18 = data.gold18K.direction === "up" ? " ▲" : data.gold18K.direction === "down" ? " ▼" : "";
      const arrowSil = data.silver.direction === "up" ? " ▲" : data.silver.direction === "down" ? " ▼" : "";

      rateItems = [
        { label: "Gold 91.6 (22K)", value: `₹${data.gold22K.price.toLocaleString('en-IN')}/g${arrow22}` },
        { label: "Gold 100 (24K)", value: `₹${data.gold24K.price.toLocaleString('en-IN')}/g${arrow24}` },
        { label: "Gold 75 (18K)", value: `₹${data.gold18K.price.toLocaleString('en-IN')}/g${arrow18}` },
        { label: "Silver (Pure)", value: `₹${data.silver.price.toFixed(2)}/g${arrowSil}` }
      ];

      if (!cycleIntervalId) {
        rotateNavbarTicker();
        cycleIntervalId = setInterval(rotateNavbarTicker, 3500);
      }
    }

    // 6. Homepage Rates Card update routine
    function updateHomepageRatesCard(data) {
      const cardGold24Price = document.getElementById("cardGold24Price");
      const cardGold22Price = document.getElementById("cardGold22Price");
      const cardGold18Price = document.getElementById("cardGold18Price");
      const cardSilverPrice = document.getElementById("cardSilverPrice");
      const cardLastUpdated = document.getElementById("cardLastUpdated");
      const rateStatusMessage = document.getElementById("rateStatusMessage");

      if (cardGold24Price) {
        cardGold24Price.textContent = `₹${data.gold24K.price.toLocaleString('en-IN')}`;
      }
      if (cardGold22Price) {
        cardGold22Price.textContent = `₹${data.gold22K.price.toLocaleString('en-IN')}`;
      }
      if (cardGold18Price) {
        cardGold18Price.textContent = `₹${data.gold18K.price.toLocaleString('en-IN')}`;
      }
      if (cardSilverPrice) {
        cardSilverPrice.textContent = `₹${data.silver.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      
      updateChangeElement("cardGold24Change", data.gold24K);
      updateChangeElement("cardGold22Change", data.gold22K);
      updateChangeElement("cardGold18Change", data.gold18K);
      updateChangeElement("cardSilverChange", data.silver);

      if (cardLastUpdated) {
        const timeText = data.updatetimeText ? data.updatetimeText : formatToIST(data.lastUpdated);
        cardLastUpdated.textContent = `Last Updated: ${timeText}`;
      }

      if (rateStatusMessage) {
        if (data.status === "update-in-progress") {
          rateStatusMessage.className = "rate-status-badge update-in-progress";
          rateStatusMessage.innerHTML = `<span class="pulse-icon"></span> Rate update in progress`;
        } else {
          rateStatusMessage.className = "rate-status-badge";
          rateStatusMessage.innerHTML = `<span class="pulse-icon"></span> Live Rates`;
        }
      }
    }

    function updateChangeElement(elId, rateData) {
      const el = document.getElementById(elId);
      if (!el) return;
      
      el.classList.remove("up", "down", "flat");
      const direction = rateData.direction || "flat";
      const changeVal = rateData.change || 0;
      el.classList.add(direction);
      
      let indicator = "■";
      let prefix = "";
      if (direction === "up") {
        indicator = "▲";
        prefix = "+";
      } else if (direction === "down") {
        indicator = "▼";
        prefix = "-";
      }
      
      const absChange = Math.abs(changeVal);
      const formattedChange = `₹${absChange.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      el.innerHTML = `
        <span class="change-indicator">${indicator}</span>
        <span class="change-amount">${prefix}${formattedChange}</span>
      `;
    }

    // 7. Main controller fetch routine
    function fetchRates() {
      fetch("/api/rates")
        .then(res => {
          if (!res.ok) throw new Error("Server API failed");
          return res.json();
        })
        .then(data => {
          if (data && data.gold24K) {
            updateTopTicker(data);
            updateNavbarTickerItems(data);
            updateHomepageRatesCard(data);
          }
        })
        .catch(err => {
          console.warn("Using offline fallback rate values:", err);
          const fallbackData = {
            gold24K: { price: 15460, change: -0.19, direction: "down" },
            gold22K: { price: 14161, change: -0.20, direction: "down" },
            gold18K: { price: 11595, change: -0.19, direction: "down" },
            silver: { price: 246.32, change: 0.33, direction: "up" },
            lastUpdated: new Date().toISOString(),
            status: "update-in-progress"
          };
          updateTopTicker(fallbackData);
          updateNavbarTickerItems(fallbackData);
          updateHomepageRatesCard(fallbackData);
        });
    }

    // Initialize on DOM ready
    injectTopTicker();
    fetchRates();
    // Poll every 30 minutes
    setInterval(fetchRates, 1800000);
  })();

// ==========================================
// PREMIUM FLOATING LUXURY CHATBOT CONTROLLER
// ==========================================
(function() {
  // 1. Dictionary of translations
  const i18n = {
    en: {
      speechBubble: "How can I help you?",
      headerTitle: "Swarnalaya Assistant",
      headerStatus: "Active Now",
      langBtn: "தமிழ்",
      inputPlaceholder: "Type a message...",
      quickButtons: {
        rates: "Gold Rate",
        collections: "Collections",
        schemes: "Schemes",
        contact: "Contact Us",
        appointment: "Book Appointment"
      },
      welcome: "Hello! Welcome to Swarnalaya Jewellers. I am your personal shopping assistant. How can I help you today?",
      enterName: "To book a showroom appointment, please enter your full name:",
      enterPhone: "Thank you, {name}. Please enter your 10-digit mobile number:",
      enterDate: "Great! Please select or enter your preferred visit date:",
      enterTime: "Almost done. Please select or enter your preferred time slot:",
      appointmentConfirmed: "### Appointment Confirmed! 📅\n\nThank you, **{name}**! Your showroom appointment at Swarnalaya Villupuram has been recorded:\n- **Date:** {date}\n- **Time:** {time}\n- **Phone:** {phone}\n\nOur customer representative will call you shortly to confirm your visit. See you soon!",
      invalidPhone: "Please enter a valid 10-digit mobile number:",
      invalidDate: "Please enter a valid date (e.g. DD-MM-YYYY or select from calendar):",
      ratesFetchError: "Unable to retrieve today's rates. Please try again later.",
      whatsappBtn: "Chat on WhatsApp",
      selectBudget: "Please select your budget range to see product recommendations:",
      recommendationsTitle: "### Recommended for {budget}:\n\n",
      budgets: {
        b1: "Under ₹10,000",
        b2: "₹10,000 - ₹50,000",
        b3: "₹50,000 - ₹2,00,000",
        b4: "Above ₹2,00,000"
      },
      recommendations: {
        b1: "- **Silver Chains & Anklets (Kolusu):** Beautiful, pure silver options.\n- **Nose Pins:** Exquisite light-weight diamond or gold nose studs.\n- **18K Earrings & Pendants:** Perfect for gifts and daily wear.",
        b2: "- **22K Gold Rings:** Lightweight daily wear options.\n- **Gold Bangles:** Exquisite single bangles or lightweight pairs.\n- **Dailywear Necklaces:** Slim 22K chains with beautiful pendants.\n- **Diamond Studs:** Small diamond-accented earrings.",
        b3: "- **Premium Gold Necklaces:** Beautifully crafted chokers and short necklaces.\n- **Bangle Sets:** Heavy 22K gold bangles for festive wear.\n- **Solitaire Diamond Rings:** Certified VVS-DEF diamond rings.\n- **Gemstone Sets:** Ruby, emerald, or pearl necklaces.",
        b4: "- **Heavy Bridal Necklaces:** Grand antique chokers, temple designs, and heavy harams.\n- **Complete Wedding Sets:** Full bridal sets for the perfect bride.\n- **Premium Diamond Bridal Sets:** Stunning luxury diamond necklaces and bangles."
      }
    },
    ta: {
      speechBubble: "உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
      headerTitle: "ஸ்வர்ணாலயா உதவி",
      headerStatus: "இப்போது செயல்பாட்டில்",
      langBtn: "English",
      inputPlaceholder: "செய்தியை தட்டச்சு செய்யவும்...",
      quickButtons: {
        rates: "தங்க விலை",
        collections: "ஆபரணங்கள்",
        schemes: "சேமிப்பு திட்டங்கள்",
        contact: "தொடர்பு கொள்ள",
        appointment: "அப்பாயிண்ட்மெண்ட்"
      },
      welcome: "வணக்கம்! ஸ்வர்ணாலயா ஜுவல்லர்ஸிற்கு உங்களை வரவேற்கிறோம். நான் உங்கள் தனிப்பட்ட உதவி உதவியாளர். இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
      enterName: "ஷோரூம் அப்பாயிண்ட்மெண்ட் பதிவு செய்ய, தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும்:",
      enterPhone: "நன்றி, {name}. உங்கள் 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்:",
      enterDate: "அருமை! நீங்கள் வர விரும்பும் தேதியைத் தேர்ந்தெடுக்கவும் அல்லது உள்ளிடவும்:",
      enterTime: "முடிவடையும் நிலை. நீங்கள் வர விரும்பும் நேரத்தைத் தேர்ந்தெடுக்கவும் அல்லது உள்ளிடவும்:",
      appointmentConfirmed: "### அப்பாயிண்ட்மெண்ட் உறுதிசெய்யப்பட்டது! 📅\n\nநன்றி, **{name}**! ஸ்வர்ணாலயா விழுப்புரம் ஷோரூமில் உங்களுக்கான அப்பாயிண்ட்மெண்ட் பதிவு செய்யப்பட்டுள்ளது:\n- **தேதி:** {date}\n- **நேரம்:** {time}\n- **தொலைபேசி:** {phone}\n\nஉங்கள் வருகையை உறுதிப்படுத்த எங்கள் வாடிக்கையாளர் பிரதிநிதி விரைவில் உங்களை அழைப்பார். நன்றி!",
      invalidPhone: "தயவுசெய்து சரியான 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்:",
      invalidDate: "தயவுசெய்து சரியான தேதியை உள்ளிடவும் (DD-MM-YYYY அல்லது காலெண்டரிலிருந்து தேர்ந்தெடுக்கவும்):",
      ratesFetchError: "இன்றைய விலையைப் பெற முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.",
      whatsappBtn: "வாட்ஸ்அப்பில் அரட்டையடிக்க",
      selectBudget: "தயாரிப்பு பரிந்துரைகளைக் காண உங்கள் பட்ஜெட் வரம்பைத் தேர்ந்தெடுக்கவும்:",
      recommendationsTitle: "### {budget} வரம்பிற்கான பரிந்துரைகள்:\n\n",
      budgets: {
        b1: "₹10,000-க்கு கீழ்",
        b2: "₹10,000 - ₹50,000",
        b3: "₹50,000 - ₹2,00,000",
        b4: "₹2,00,000-க்கு மேல்"
      },
      recommendations: {
        b1: "- **வெள்ளிச் சங்கிலிகள் & கொலுசுகள்:** அழகான, தூய வெள்ளி விருப்பங்கள்.\n- **மூக்குத்திகள்:** நேர்த்தியான குறைந்த எடை வைர அல்லது தங்க மூக்குத்திகள்.\n- **18K கம்மல்கள் & பதக்கங்கள்:** பரிசுகள் மற்றும் தினசரி பயன்பாட்டிற்கு ஏற்றது.",
        b2: "- **22K தங்க மோதிரங்கள்:** குறைந்த எடை தினசரி பயன்பாட்டு மோதிரங்கள்.\n- **தங்க வளையல்கள்:** நேர்த்தியான வளையல்கள் அல்லது குறைந்த எடை சோடி வளையல்கள்.\n- **தினசரி நெக்லஸ்கள்:** அழகான பதக்கங்களுடன் கூடிய மெல்லிய 22K சங்கிலிகள்.\n- **வைர மூக்குத்திகள்:** வைரங்கள் பதிக்கப்பட்ட மூக்குத்திகள்.",
        b3: "- **பிரீமியம் தங்க நெக்லஸ்கள்:** நேர்த்தியாக வடிவமைக்கப்பட்ட சோக்கர்கள் மற்றும் சிறிய நெக்லஸ்கள்.\n- **வளையல் செட்கள்:** பண்டிகை காலத்திற்கான கனமான 22K தங்க வளையல்கள்.\n- **வைர மோதிரங்கள்:** சான்றளிக்கப்பட்ட VVS-DEF வைர மோதிரங்கள்.\n- **நவரத்தின செட்கள்:** ரூபி, எமரால்டு அல்லது முத்து நெக்லஸ்கள்.",
        b4: "- **கனமான மணப்பெண் நெக்லஸ்கள்:** பிரமாண்டமான ஆண்டிக் சோக்கர்கள், கோவில் ஆபரணங்கள் மற்றும் கனமான ஹாரங்கள்.\n- **முழு திருமண செட்கள்:** மணப்பெண்ணுக்கான முழுமையான திருமண நகைகள்.\n- **பிரீமியம் வைர மணப்பெண் செட்கள்:** அசத்தலான சொகுசு வைர நெக்லஸ்கள் மற்றும் வளையல்கள்."
      }
    }
  };

  // 2. State management
  let chatState = {
    lang: "en",
    state: "normal", // normal, booking_name, booking_phone, booking_date, booking_time, waiting_budget
    bookingData: { name: "", phone: "", date: "", time: "" },
    history: [] // { role: "bot" | "user", text: "..." }
  };

  // 3. Inject HTML Elements
  function injectChatbot() {
    if (document.getElementById("chatbotTriggerContainer")) return;

    // Trigger & Speech bubble container
    const container = document.createElement("div");
    container.id = "chatbotTriggerContainer";
    container.className = "chatbot-trigger-container";
    container.innerHTML = `
      <div class="chatbot-speech-bubble" id="chatbotSpeechBubble">
        <span id="chatbotSpeechBubbleText">${i18n[chatState.lang].speechBubble}</span>
        <span class="chatbot-speech-bubble-close" id="chatbotSpeechBubbleClose">&times;</span>
      </div>
      <button class="chatbot-trigger-btn" id="chatbotTriggerBtn" aria-label="Open Chatbot">
        <img src="chatbot-avatar.png" alt="Swarnalaya Assistant Avatar" />
      </button>
    `;

    // Window container
    const window = document.createElement("div");
    window.id = "chatbotWindow";
    window.className = "chatbot-window";
    window.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-header-avatar">
            <img src="chatbot-avatar.png" alt="Swarnalaya Assistant Avatar" />
          </div>
          <div class="chatbot-header-title">
            <h4 id="chatbotHeaderTitleText">${i18n[chatState.lang].headerTitle}</h4>
            <span id="chatbotHeaderStatusText">${i18n[chatState.lang].headerStatus}</span>
          </div>
        </div>
        <div class="chatbot-header-controls">
          <button class="chatbot-lang-toggle" id="chatbotLangToggle">${i18n[chatState.lang].langBtn}</button>
          <button class="chatbot-close-btn" id="chatbotCloseBtn" aria-label="Close Chatbot">&times;</button>
        </div>
      </div>
      
      <div class="chatbot-body" id="chatbotBody"></div>
      
      <div class="chatbot-quick-options" id="chatbotQuickOptions"></div>
      
      <div class="chatbot-footer">
        <input type="text" class="chatbot-input" id="chatbotInput" placeholder="${i18n[chatState.lang].inputPlaceholder}" />
        <button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send Message">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;

    document.body.appendChild(container);
    document.body.appendChild(window);

    // Initial load handlers
    setupEventListeners();
    updateQuickOptions();
    addBotMessage(i18n[chatState.lang].welcome);
  }

  // 4. Update horizontal quick buttons
  function updateQuickOptions() {
    const track = document.getElementById("chatbotQuickOptions");
    if (!track) return;
    const btns = i18n[chatState.lang].quickButtons;
    
    track.innerHTML = `
      <button class="quick-option-btn" data-action="rates"><i class="fas fa-coins"></i> ${btns.rates}</button>
      <button class="quick-option-btn" data-action="collections"><i class="fas fa-gem"></i> ${btns.collections}</button>
      <button class="quick-option-btn" data-action="schemes"><i class="fas fa-piggy-bank"></i> ${btns.schemes}</button>
      <button class="quick-option-btn" data-action="contact"><i class="fas fa-phone"></i> ${btns.contact}</button>
      <button class="quick-option-btn" data-action="appointment"><i class="fas fa-calendar-check"></i> ${btns.appointment}</button>
    `;

    // Attach click events
    track.querySelectorAll(".quick-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        handleQuickAction(action);
      });
    });
  }

  // 5. Setup event listeners
  function setupEventListeners() {
    const triggerBtn = document.getElementById("chatbotTriggerBtn");
    const closeBtn = document.getElementById("chatbotCloseBtn");
    const langToggle = document.getElementById("chatbotLangToggle");
    const bubbleClose = document.getElementById("chatbotSpeechBubbleClose");
    const bubble = document.getElementById("chatbotSpeechBubble");
    const chatWin = document.getElementById("chatbotWindow");
    const sendBtn = document.getElementById("chatbotSendBtn");
    const chatInput = document.getElementById("chatbotInput");

    // Open chat
    triggerBtn.addEventListener("click", () => {
      chatWin.classList.toggle("active");
      if (bubble) bubble.style.display = "none";
      scrollToBottom();
      chatInput.focus();
    });

    // Close chat
    closeBtn.addEventListener("click", () => {
      chatWin.classList.remove("active");
    });

    // Close speech bubble
    if (bubbleClose) {
      bubbleClose.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent opening chatbot
        if (bubble) bubble.style.display = "none";
      });
    }

    // Toggle Language
    langToggle.addEventListener("click", () => {
      chatState.lang = chatState.lang === "en" ? "ta" : "en";
      
      // Update UI elements
      langToggle.textContent = i18n[chatState.lang].langBtn;
      document.getElementById("chatbotHeaderTitleText").textContent = i18n[chatState.lang].headerTitle;
      document.getElementById("chatbotHeaderStatusText").textContent = i18n[chatState.lang].headerStatus;
      chatInput.placeholder = i18n[chatState.lang].inputPlaceholder;
      
      const bubbleText = document.getElementById("chatbotSpeechBubbleText");
      if (bubbleText) bubbleText.textContent = i18n[chatState.lang].speechBubble;
      
      updateQuickOptions();

      // If we only have the welcome message, translate it
      const body = document.getElementById("chatbotBody");
      if (body && body.children.length <= 1) {
        body.innerHTML = "";
        chatState.history = [];
        addBotMessage(i18n[chatState.lang].welcome);
      } else {
        // Send language switch notification response
        addBotMessage(chatState.lang === "en" ? "Language switched to English." : "தமிழ் மொழிக்கு மாற்றப்பட்டது.");
      }
    });

    // Send on click
    sendBtn.addEventListener("click", () => {
      submitUserMessage();
    });

    // Send on enter key
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        submitUserMessage();
      }
    });
  }

  // 6. User Message Submission
  function submitUserMessage() {
    const input = document.getElementById("chatbotInput");
    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    addUserMessage(text);

    // Route message based on current state
    if (chatState.state.startsWith("booking_")) {
      handleAppointmentFlow(text);
    } else {
      processChatMessage(text);
    }
  }

  // 7. Add messages to DOM
  function addUserMessage(text) {
    const body = document.getElementById("chatbotBody");
    if (!body) return;

    const msg = document.createElement("div");
    msg.className = "chat-message user";
    msg.textContent = text;
    body.appendChild(msg);

    chatState.history.push({ role: "user", text: text });
    scrollToBottom();
  }

  function addBotMessage(text, isHTML = false) {
    const body = document.getElementById("chatbotBody");
    if (!body) return;

    // Remove typing indicator if present
    removeTypingIndicator();

    const msg = document.createElement("div");
    msg.className = "chat-message bot";
    
    if (isHTML) {
      msg.innerHTML = text;
    } else {
      // Parse markdown formatting, links, and symbols
      let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/### (.*?)\n/g, "<h5>$1</h5>")
        .replace(/- (.*?)\n/g, "• $1<br/>")
        .replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
          const isExternal = !url.startsWith("tel:") && !url.startsWith("mailto:");
          return `<a href="${url}"${isExternal ? ' target="_blank"' : ''} style="color: #c5a059; text-decoration: underline; font-weight: 600;">${label}</a>`;
        })
        .replace(/📞/g, '<i class="fas fa-phone" style="color: #c5a059; margin-left: 3px; margin-right: 3px;"></i>')
        .replace(/\n/g, "<br/>");
      msg.innerHTML = formatted;
    }

    body.appendChild(msg);
    chatState.history.push({ role: "bot", text: text });
    scrollToBottom();
  }

  // 8. Typing Indicator helper
  function showTypingIndicator() {
    const body = document.getElementById("chatbotBody");
    if (!body || document.getElementById("chatbotTyping")) return;

    const ind = document.createElement("div");
    ind.id = "chatbotTyping";
    ind.className = "chat-message bot typing-indicator-container";
    ind.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    
    // Add custom typing dot style if not present
    if (!document.getElementById("chatbotTypingStyles")) {
      const style = document.createElement("style");
      style.id = "chatbotTypingStyles";
      style.innerHTML = `
        .typing-indicator-container {
          display: flex;
          gap: 4px;
          padding: 12px 16px !important;
          align-items: center;
          width: 55px;
          justify-content: center;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: #9ca3af;
          border-radius: 50%;
          animation: typing-bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }

    body.appendChild(ind);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const ind = document.getElementById("chatbotTyping");
    if (ind) ind.remove();
  }

  function scrollToBottom() {
    const body = document.getElementById("chatbotBody");
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  // 9. Process conversation with Gemini API
  async function processChatMessage(text) {
    showTypingIndicator();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: chatState.history.slice(0, -1), // Exclude current user message since backend appends it
          lang: chatState.lang
        })
      });

      if (!response.ok) {
        throw new Error("Chat response status not OK");
      }

      const data = await response.json();
      addBotMessage(data.reply);
    } catch (err) {
      console.warn("Unable to fetch reply from Gemini, using offline fallback.", err);
      // Client-side fallback matching
      setTimeout(() => {
        const fallback = getOfflineFallbackClient(text);
        addBotMessage(fallback);
      }, 600);
    }
  }

  // Client-side basic matcher in case API is completely blocked/offline
  function getOfflineFallbackClient(message) {
    const msg = message.toLowerCase();
    const currentLang = chatState.lang;
    
    if (currentLang === "ta") {
      if (msg.includes("விழுப்புரம்") || msg.includes("முகவரி") || msg.includes("தொடர்பு") || msg.includes("போன்") || msg.includes("வாட்ஸ்அப்")) {
        return "ஸ்வர்ணாலயா ஜுவல்லர்ஸ் முகவரி:\n791C, PJN ரோடு, விழுப்புரம் - 605 602, தமிழ்நாடு.\nதொலைபேசி: +91 9837371616.\nவிவரங்களுக்கு கீழே உள்ள 'தொடர்பு கொள்ள' பொத்தானைக் கிளிக் செய்யவும்.";
      }
      if (msg.includes("திட்டம்") || msg.includes("விருத்தி") || msg.includes("சேமிப்பு")) {
        return "ஸ்வர்ணாலயாவில் 4 பிரபலமான சேமிப்புத் திட்டங்கள் உள்ளன:\n1. தனா விருத்தி (VA செய்கூலி தள்ளுபடி)\n2. செல்வ விருத்தி (12வது தவணை இலவசம்)\n3. குபேர விருத்தி (பழைய தங்க வைப்பு)\n4. கனக விருத்தி (தினசரி தங்க எடை சேமிப்பு)\n\nமேலும் அறிய கீழே உள்ள 'சேமிப்பு திட்டங்கள்' பொத்தானைக் கிளிக் செய்யவும்.";
      }
      if (msg.includes("பதிவு") || msg.includes("அப்பாயிண்ட்மெண்ட்")) {
        return "ஷோரூம் அப்பாயிண்ட்மெண்ட் பதிவு செய்ய கீழே உள்ள 'அப்பாயிண்ட்மெண்ட்' பொத்தானைக் கிளிக் செய்யவும்.";
      }
      return "ஸ்வர்ணாலயா வாடிக்கையாளர் உதவிக்கு நன்றி. தற்சமயம் AI சேவை ஆஃப்லைனில் உள்ளது. ஆனால் நான் ஆபரண விவரங்கள், தங்க விலை, மற்றும் அப்பாயிண்ட்மெண்ட்களில் உதவ முடியும். கீழே உள்ள விருப்பங்களை பயன்படுத்தவும்.";
    } else {
      if (msg.includes("address") || msg.includes("location") || msg.includes("contact") || msg.includes("phone") || msg.includes("whatsapp") || msg.includes("villupuram")) {
        return "Swarnalaya Jewellers Address:\n791C, PJN Road, Villupuram - 605 602, Tamil Nadu.\nPhone: +91 9837371616.\nYou can also click the 'Contact Us' button to start a WhatsApp chat with our staff.";
      }
      if (msg.includes("scheme") || msg.includes("savings") || msg.includes("vruthi") || msg.includes("thanaa") || msg.includes("selva")) {
        return "We offer 4 savings schemes:\n1. Thanaa Vruthi (Value Addition discount)\n2. Selva Vruthi (12th installment free)\n3. Kubera Vruthi (Old gold investment)\n4. Kanaga Vruthi (Daily gold rate locking)\n\nClick the 'Schemes' button below to see detailed benefits of each scheme.";
      }
      if (msg.includes("appointment") || msg.includes("book") || msg.includes("visit")) {
        return "To book a showroom visit, please click the 'Book Appointment' button below to launch our interactive booking helper.";
      }
      return "Thank you for reaching out to Swarnalaya Jewellers. AI service is currently in offline mode (API key not configured). I can still help you with gold rates, schemes, contacts, and appointments. Please use the quick options below!";
    }
  }

  // 10. Quick Actions Router
  function handleQuickAction(action) {
    if (action === "rates") {
      showRatesAction();
    } else if (action === "collections") {
      showCollectionsAction();
    } else if (action === "schemes") {
      showSchemesAction();
    } else if (action === "contact") {
      showContactAction();
    } else if (action === "appointment") {
      startAppointmentFlow();
    }
  }

  // 11. Rates Card
  async function showRatesAction() {
    showTypingIndicator();
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error("API failed");
      const rates = await response.json();
      
      let rateMsg = "";
      if (chatState.lang === "ta") {
        rateMsg = `### இன்றைய சென்னை தங்க விலை 🪙\n\n**ஒரு கிராம் விலை விவரம்:**\n- **24K தங்கம் (999):** ₹${rates.gold24K.price.toLocaleString('en-IN')}/g\n- **22K தங்கம் (916):** ₹${rates.gold22K.price.toLocaleString('en-IN')}/g\n- **18K தங்கம் (750):** ₹${rates.gold18K.price.toLocaleString('en-IN')}/g\n- **வெள்ளி (தூயது):** ₹${rates.silver.price.toFixed(2)}/g\n\n*கடைசியாக புதுப்பிக்கப்பட்டது: ${formatToIST(rates.lastUpdated)}*`;
      } else {
        rateMsg = `### Chennai Live Gold Rates Today 🪙\n\n**Price per single gram:**\n- **Gold 24K (999):** ₹${rates.gold24K.price.toLocaleString('en-IN')}/g\n- **Gold 22K (916):** ₹${rates.gold22K.price.toLocaleString('en-IN')}/g\n- **Gold 18K (750):** ₹${rates.gold18K.price.toLocaleString('en-IN')}/g\n- **Silver (Pure):** ₹${rates.silver.price.toFixed(2)}/g\n\n*Last Updated: ${formatToIST(rates.lastUpdated)}*`;
      }
      addBotMessage(rateMsg);
    } catch (e) {
      console.warn("Rates fetch failed in chatbot, using fallback", e);
      addBotMessage(i18n[chatState.lang].ratesFetchError);
    }
  }

  // 12. Collections & Budget Selector
  function showCollectionsAction() {
    addBotMessage(i18n[chatState.lang].selectBudget);
    
    // Inject budget select buttons
    const body = document.getElementById("chatbotBody");
    const container = document.createElement("div");
    container.className = "bot-rich-list";
    
    const budgets = i18n[chatState.lang].budgets;
    
    container.innerHTML = `
      <div class="bot-rich-item" data-budget="b1">
        <h5>${budgets.b1}</h5>
      </div>
      <div class="bot-rich-item" data-budget="b2">
        <h5>${budgets.b2}</h5>
      </div>
      <div class="bot-rich-item" data-budget="b3">
        <h5>${budgets.b3}</h5>
      </div>
      <div class="bot-rich-item" data-budget="b4">
        <h5>${budgets.b4}</h5>
      </div>
    `;

    container.querySelectorAll(".bot-rich-item").forEach(item => {
      item.addEventListener("click", () => {
        const budgetId = item.getAttribute("data-budget");
        const budgetName = budgets[budgetId];
        addUserMessage(budgetName);
        
        // Show recommendations
        showTypingIndicator();
        setTimeout(() => {
          const title = i18n[chatState.lang].recommendationsTitle.replace("{budget}", budgetName);
          const recText = i18n[chatState.lang].recommendations[budgetId];
          addBotMessage(title + recText);
        }, 500);
      });
    });

    body.appendChild(container);
    scrollToBottom();
  }

  // 13. Schemes Card
  function showSchemesAction() {
    let msg = "";
    if (chatState.lang === "ta") {
      msg = "### ஸ்வர்ணாலயா நகைச் சேமிப்பு திட்டங்கள் 🐖\n\nஎங்களின் 4 சிறப்பான சேமிப்பு திட்டங்கள் இதோ. மேலும் விபரங்களுக்கு நீங்கள் விரும்பும் திட்டத்தைத் தேர்ந்தெடுக்கவும்:";
    } else {
      msg = "### Swarnalaya Savings Schemes 🐖\n\nWe offer 4 custom savings schemes. Click on any scheme below to see detailed benefits:";
    }
    
    addBotMessage(msg);
    
    const body = document.getElementById("chatbotBody");
    const container = document.createElement("div");
    container.className = "bot-rich-list";
    
    container.innerHTML = `
      <div class="bot-rich-item" data-scheme="thanaa">
        <h5>Thanaa Vruthi (தனா விருத்தி)</h5>
        <p>${chatState.lang === 'ta' ? 'செய்கூலியில் 15% வரை தள்ளுபடி & வைரத்திற்கு 40%' : 'Up to 15% Gold VA discount & 40% Diamond discount'}</p>
      </div>
      <div class="bot-rich-item" data-scheme="selva">
        <h5>Selva Vruthi (செல்வ விருத்தி)</h5>
        <p>${chatState.lang === 'ta' ? '12-வது தவணை முற்றிலும் இலவசம்!' : '12th monthly installment is completely FREE!'}</p>
      </div>
      <div class="bot-rich-item" data-scheme="kubera">
        <h5>Kubera Vruthi (குபேர விருத்தி)</h5>
        <p>${chatState.lang === 'ta' ? 'பழைய தங்கம் வைப்புத் திட்டம் - செய்கூலியில் 75% தள்ளுபடி' : 'Old gold deposit - 75% discount on Value Addition'}</p>
      </div>
      <div class="bot-rich-item" data-scheme="kanaga">
        <h5>Kanaga Vruthi (கனக விருத்தி)</h5>
        <p>${chatState.lang === 'ta' ? 'தினசரி தங்க எடை சேமிப்பு - விலை உயர்வு பாதுகாப்பு' : 'Daily gold weight accumulation - price hike hedge'}</p>
      </div>
    `;

    container.querySelectorAll(".bot-rich-item").forEach(item => {
      item.addEventListener("click", () => {
        const scheme = item.getAttribute("data-scheme");
        let details = "";
        
        if (scheme === "thanaa") {
          addUserMessage("Thanaa Vruthi");
          if (chatState.lang === "ta") {
            details = "### தனா விருத்தி திட்டம் (Thanaa Vruthi)\n\n- **வகை:** ரொக்கச் சேமிப்புத் திட்டம்.\n- **சேமிப்பு அளவு:** ₹1,000 முதல் அதன் மடங்குகளில் செலுத்தி வரலாம்.\n- **தவணைகள்:** 12 மாதத் தவணைகள் (360 நாட்கள்).\n- **பயன்கள்:** முதிர்வின் போது தங்கம் வாங்கும்போது செய்கூலி மற்றும் சேதாரத்தில் (Value Addition) 15% வரை தள்ளுபடி. வைர நகைகள் வாங்கும்போது 40% தள்ளுபடி.";
          } else {
            details = "### Thanaa Vruthi Scheme\n\n- **Type:** Cash-based savings scheme.\n- **Installments:** Pay in multiples of ₹1,000 for 12 monthly installments (360 days).\n- **Benefits:** Upon maturity, enjoy up to a 15% discount on Value Addition (making charges) for gold jewellery and a flat 40% discount for diamond purchases.";
          }
        } else if (scheme === "selva") {
          addUserMessage("Selva Vruthi");
          if (chatState.lang === "ta") {
            details = "### செல்வ விருத்தி திட்டம் (Selva Vruthi)\n\n- **வகை:** பிரீமியம் ரொக்கச் சேமிப்பு.\n- **சேமிப்பு அளவு:** ₹250 முதல் அதன் மடங்குகளில் செலுத்தி வரலாம்.\n- **தவணைகள்:** நீங்கள் 11 மாதங்கள் செலுத்த வேண்டும்.\n- **பயன்கள்:** 12-வது தவணைத் தொகையை ஸ்வர்ணாலயா முற்றிலும் இலவசமாக வழங்கும் (We pay the 12th installment)!";
          } else {
            details = "### Selva Vruthi Scheme\n\n- **Type:** Premium cash savings scheme.\n- **Installments:** Pay in multiples of ₹250 for 11 months.\n- **Benefits:** The 12th installment is completely FREE - paid by Swarnalaya on your behalf!";
          }
        } else if (scheme === "kubera") {
          addUserMessage("Kubera Vruthi");
          if (chatState.lang === "ta") {
            details = "### குபேர விருத்தி திட்டம் (Kubera Vruthi)\n\n- **வகை:** ஒருமுறை பழைய தங்க வைப்பு.\n- **சேமிப்பு அளவு:** குறைந்தது 8 கிராம் 22K பழைய தங்க நகைகளை வைப்பு வைக்க வேண்டும்.\n- **காலம்:** 360 நாட்கள்.\n- **பயன்கள்:** வைப்பு வைக்கும் நாளின் தங்க எடையை அப்படியே லாக் செய்து விடலாம். முதிர்வின் போது செய்கூலியில் 75% வரை சிறப்பு தள்ளுபடி பெறலாம்.";
          } else {
            details = "### Kubera Vruthi Scheme\n\n- **Type:** One-time old gold investment scheme.\n- **Min Deposit:** 8 grams of 22K gold jewellery.\n- **Tenure:** 360 days.\n- **Benefits:** Locks the gold weight on day one (protecting from price increases), and you get a 75% discount on Value Addition (making charges) on maturity.";
          }
        } else if (scheme === "kanaga") {
          addUserMessage("Kanaga Vruthi");
          if (chatState.lang === "ta") {
            details = "### கனக விருத்தி திட்டம் (Kanaga Vruthi)\n\n- **வகை:** தினசரி தங்க எடை சேமிப்பு.\n- **சேமிப்பு அளவு:** நாள் ஒன்றுக்கு ₹100 முதல் சேமிக்கலாம்.\n- **காலம்:** 360 நாட்கள்.\n- **பயன்கள்:** நீங்கள் செலுத்தும் பணம் அன்றைய தங்க விலையின் அடிப்படையில் உடனுக்குடன் தங்க எடையாக மாற்றப்பட்டு சேமிக்கப்படும். இதனால் விலை உயர்விலிருந்து பாதுகாப்பு கிடைக்கும்.";
          } else {
            details = "### Kanaga Vruthi Scheme\n\n- **Type:** Smart gold weight accumulation scheme.\n- **Savings:** Start from ₹100 per day.\n- **Tenure:** 360 days.\n- **Benefits:** The money you deposit is instantly converted daily into gold weight based on that day's gold rate. Perfect protection against gold price hikes.";
          }
        }
        
        showTypingIndicator();
        setTimeout(() => {
          addBotMessage(details);
        }, 500);
      });
    });

    body.appendChild(container);
    scrollToBottom();
  }

  // 14. Contact Us card
  function showContactAction() {
    let msg = "";
    if (chatState.lang === "ta") {
      msg = `### தொடர்புக்கு 📞\n\n**ஸ்வர்ணாலயா ஜுவல்லர்ஸ் (விழுப்புரம்)**\n\n- **முகவரி:** 791C, PJN ரோடு, விழுப்புரம் - 605 602 (தமிழ்நாடு).\n- **தொலைபேசி:** [+91 9837371616](tel:+919837371616) (கடை ஊழியர் தொடர்பு எண்)\n- **மின்னஞ்சல்:** info@swarnalaya.com\n- **நேரம்:** காலை 9:30 முதல் இரவு 9:00 மணி வரை (வாரத்தின் அனைத்து நாட்களும்)\n\nவாட்ஸ்அப்பில் எங்களிடம் நேரடியாகப் பேச கீழே உள்ள பட்டனைக் கிளிக் செய்யவும்:`;
    } else {
      msg = `### Contact Showroom 📞\n\n**Swarnalaya Jewellers (Villupuram)**\n\n- **Address:** 791C, PJN Road, Villupuram - 605 602 (Tamil Nadu).\n- **Phone:** [+91 9837371616](tel:+919837371616) (Staff Contact Number)\n- **Email:** info@swarnalaya.com\n- **Hours:** 9:30 AM to 9:00 PM (Open all 7 days)\n\nTo chat with our showroom staff instantly on WhatsApp, click the button below:`;
    }
    
    addBotMessage(msg);
    
    // Inject WhatsApp Button
    const body = document.getElementById("chatbotBody");
    const container = document.createElement("div");
    container.className = "chat-form-container";
    
    const label = i18n[chatState.lang].whatsappBtn;
    const link = "https://wa.me/919837371616?text=Hi%20Swarnalaya%2C%20I%20have%20a%20query%20about%20your%20jewellery...";
    
    container.innerHTML = `
      <a href="${link}" target="_blank" class="chat-form-submit" style="display:block; text-align:center; text-decoration:none;">
        <i class="fab fa-whatsapp"></i> ${label}
      </a>
    `;
    body.appendChild(container);
    scrollToBottom();
  }

  // 15. Appointment Wizard Flow
  function startAppointmentFlow() {
    chatState.state = "booking_name";
    chatState.bookingData = { name: "", phone: "", date: "", time: "" };
    addBotMessage(i18n[chatState.lang].enterName);
  }

  function handleAppointmentFlow(text) {
    const lang = chatState.lang;

    if (chatState.state === "booking_name") {
      chatState.bookingData.name = text;
      chatState.state = "booking_phone";
      
      const reply = i18n[lang].enterPhone.replace("{name}", text);
      addBotMessage(reply);
      
      // Inject standard phone input for ease of use
      injectFormInput("tel", "9876543210");
      
    } else if (chatState.state === "booking_phone") {
      // Basic 10-digit validation
      const cleaned = text.replace(/\D/g, "");
      if (cleaned.length < 10) {
        addBotMessage(i18n[lang].invalidPhone);
        injectFormInput("tel", "9876543210");
        return;
      }
      
      chatState.bookingData.phone = text;
      chatState.state = "booking_date";
      addBotMessage(i18n[lang].enterDate);
      
      // Inject Date picker input
      injectFormInput("date", "");
      
    } else if (chatState.state === "booking_date") {
      if (!text) {
        addBotMessage(i18n[lang].invalidDate);
        injectFormInput("date", "");
        return;
      }
      
      chatState.bookingData.date = text;
      chatState.state = "booking_time";
      addBotMessage(i18n[lang].enterTime);
      
      // Inject Time Slot buttons
      injectTimeSlots();
      
    } else if (chatState.state === "booking_time") {
      chatState.bookingData.time = text;
      chatState.state = "normal"; // Reset state
      
      // Generate confirmation card
      let confMsg = i18n[lang].appointmentConfirmed
        .replace("{name}", chatState.bookingData.name)
        .replace("{date}", chatState.bookingData.date)
        .replace("{time}", chatState.bookingData.time)
        .replace("{phone}", chatState.bookingData.phone);
        
      addBotMessage(confMsg);
    }
  }

  // Inject helper HTML forms inside the chat history
  function injectFormInput(type, placeholder) {
    const body = document.getElementById("chatbotBody");
    const container = document.createElement("div");
    container.className = "chat-form-container";
    
    let inputEl = "";
    if (type === "date") {
      // Set tomorrow's date as min
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = tomorrow.toISOString().split("T")[0];
      inputEl = `<input type="date" id="chatWizardInput" class="chat-form-input" min="${minDate}" required />`;
    } else {
      inputEl = `<input type="${type}" id="chatWizardInput" class="chat-form-input" placeholder="${placeholder}" required />`;
    }
    
    container.innerHTML = `
      ${inputEl}
      <button id="chatWizardSubmit" class="chat-form-submit">${chatState.lang === 'ta' ? 'அனுப்பு' : 'Submit'}</button>
    `;
    
    body.appendChild(container);
    scrollToBottom();
    
    const input = document.getElementById("chatWizardInput");
    const submit = document.getElementById("chatWizardSubmit");
    
    submit.addEventListener("click", () => {
      let val = input.value.trim();
      if (!val) return;
      
      if (type === "date") {
        // Format date to local readable format DD-MM-YYYY
        try {
          const parts = val.split("-");
          val = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } catch (e) {}
      }
      
      container.remove();
      addUserMessage(val);
      handleAppointmentFlow(val);
    });
  }

  // Inject Time Slot buttons
  function injectTimeSlots() {
    const body = document.getElementById("chatbotBody");
    const container = document.createElement("div");
    container.className = "bot-rich-list";
    
    const slots = ["10:30 AM", "12:00 PM", "3:00 PM", "4:30 PM", "6:00 PM"];
    
    let html = "";
    slots.forEach(slot => {
      html += `
        <div class="bot-rich-item" data-slot="${slot}" style="padding: 6px 12px; margin-bottom:4px;">
          <h5 style="margin:0; text-align:center;">${slot}</h5>
        </div>
      `;
    });
    
    container.innerHTML = html;
    body.appendChild(container);
    scrollToBottom();
    
    container.querySelectorAll(".bot-rich-item").forEach(item => {
      item.addEventListener("click", () => {
        const slotVal = item.getAttribute("data-slot");
        container.remove();
        addUserMessage(slotVal);
        handleAppointmentFlow(slotVal);
      });
    });
  }

  // 16. Initialize chatbot on ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectChatbot);
  } else {
    injectChatbot();
  }
})();

// ==========================================
// SWARNALAYA VIRTUAL TRY-ON MODULE
// ==========================================

// State Management
let tryOnState = {
  currentCategory: 'necklaces',
  currentItem: 'gold-necklace.jpg',
  scale: 1.0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  dragStartX: 0,
  dragStartY: 0,
  overlayStartX: 0,
  overlayStartY: 0,
  isCameraOn: false,
  stream: null
};

// Available items for Try-On
const tryOnProducts = {
  necklaces: [
    { name: "Gold Necklace", src: "gold-necklace.jpg" },
    { name: "Gold Choker", src: "gold-choker.png" },
    { name: "Gold Mangalsutra", src: "gold-mangalsutra.png" }
  ],
  earrings: [
    { name: "Pearl Earrings", src: "pearl-earrings.jpg" },
    { name: "Emerald Earrings", src: "emerald-earrings.png" },
    { name: "Ruby Earrings", src: "ruby-earrings.png" }
  ],
  rings: [
    { name: "Diamond Ring", src: "diamond-ring.jpg" },
    { name: "Gold Ring Base 1", src: "gold-ring-base1.png" },
    { name: "Gold Ring Base 2", src: "gold-ring-base2.png" }
  ],
  pendants: [
    { name: "Ruby Pendant", src: "ruby-pendant.jpg" },
    { name: "Gemstone Pendant", src: "all-gemstone-pendants.png" }
  ]
};

// Initialize Try-on trigger and drag event listeners on ready
document.addEventListener("DOMContentLoaded", () => {
  // Setup interactive drag if workspace is present
  const container = document.getElementById("tryonCanvasContainer");
  if (container) {
    setupTryOnDrag();
    
    // Auto-run try-on module if we are on the dedicated tryon.html page (inline, not inside modal)
    const modal = document.getElementById("tryonModal");
    if (!modal) {
      switchTryOnCategory('necklaces', document.querySelector('.tryon-tab-btn'));
    }
  }
});

function switchTryOnCategory(category, tabElement) {
  tryOnState.currentCategory = category;
  
  // Update tabs visual state
  const tabs = document.querySelectorAll('.tryon-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabElement) tabElement.classList.add('active');
  
  // Set default model photo if camera is off
  const bgImg = document.getElementById("tryonBgImage");
  if (bgImg && !tryOnState.isCameraOn) {
    if (category === 'rings') {
      bgImg.src = "tryon-model-hand.png";
    } else {
      bgImg.src = "tryon-model-face.png";
    }
  }
  
  // Populate catalog list
  populateTryOnProducts();
  
  // Select first item of category
  const list = tryOnProducts[category] || [];
  if (list.length > 0) {
    selectTryOnProduct(list[0].src);
  }
}

function populateTryOnProducts() {
  const grid = document.getElementById("tryonProductsGrid");
  if (!grid) return;
  
  const list = tryOnProducts[tryOnState.currentCategory] || [];
  grid.innerHTML = "";
  
  list.forEach(prod => {
    const item = document.createElement("div");
    item.className = "tryon-grid-item" + (prod.src === tryOnState.currentItem ? " active" : "");
    item.onclick = () => selectTryOnProduct(prod.src, item);
    item.innerHTML = `
      <img class="tryon-item-img" src="${prod.src}" alt="${prod.name}" />
      <p class="tryon-item-title">${prod.name}</p>
    `;
    grid.appendChild(item);
  });
}

function selectTryOnProduct(src, itemElement) {
  tryOnState.currentItem = src;
  
  // Find product name from tryOnProducts catalog for activity logging
  let productName = "Jewelry Item";
  if (typeof tryOnProducts !== 'undefined') {
    for (const cat in tryOnProducts) {
      const found = tryOnProducts[cat].find(p => p.src === src);
      if (found) {
        productName = found.name;
        break;
      }
    }
  }

  // Report try-on activity
  if (typeof window.logCustomerActivity === 'function') {
    window.logCustomerActivity('tryon', `Tried on: ${productName} (${src})`);
  }
  
  // Update catalog item active border
  const items = document.querySelectorAll('.tryon-grid-item');
  items.forEach(i => i.classList.remove('active'));
  
  if (itemElement) {
    itemElement.classList.add('active');
  } else {
    // Find the item with matching img src
    const targetItem = Array.from(items).find(i => {
      const img = i.querySelector('.tryon-item-img');
      return img && img.getAttribute('src') === src;
    });
    if (targetItem) {
      targetItem.classList.add('active');
    }
  }
  
  // Set overlay image source
  const overlayImg = document.getElementById("tryonOverlayItem");
  if (overlayImg) {
    overlayImg.src = src;
  }
  
  // Reset placement adjustments
  resetTryOnOverlay();
}

function setupTryOnDrag() {
  const wrapper = document.getElementById("tryonOverlayWrapper");
  const container = document.getElementById("tryonCanvasContainer");
  if (!wrapper || !container) return;
  
  // Mouse listeners
  wrapper.addEventListener("mousedown", dragStart);
  window.addEventListener("mousemove", dragMove);
  window.addEventListener("mouseup", dragEnd);
  
  // Touch listeners (Mobile support)
  wrapper.addEventListener("touchstart", dragStart, { passive: false });
  window.addEventListener("touchmove", dragMove, { passive: false });
  window.addEventListener("touchend", dragEnd);
  
  function dragStart(e) {
    e.preventDefault();
    tryOnState.isDragging = true;
    
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    
    tryOnState.dragStartX = clientX;
    tryOnState.dragStartY = clientY;
    tryOnState.overlayStartX = tryOnState.translateX;
    tryOnState.overlayStartY = tryOnState.translateY;
  }
  
  function dragMove(e) {
    if (!tryOnState.isDragging) return;
    
    const clientX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith("touch") ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - tryOnState.dragStartX;
    const deltaY = clientY - tryOnState.dragStartY;
    
    tryOnState.translateX = tryOnState.overlayStartX + deltaX;
    tryOnState.translateY = tryOnState.overlayStartY + deltaY;
    
    updateTryOnTransform();
  }
  
  function dragEnd() {
    tryOnState.isDragging = false;
  }
}

function updateTryOnTransform() {
  const wrapper = document.getElementById("tryonOverlayWrapper");
  const scaleSlider = document.getElementById("tryonScaleSlider");
  const rotateSlider = document.getElementById("tryonRotateSlider");
  
  if (scaleSlider) tryOnState.scale = parseFloat(scaleSlider.value);
  if (rotateSlider) tryOnState.rotate = parseInt(rotateSlider.value);
  
  if (wrapper) {
    wrapper.style.transform = `translate3d(${tryOnState.translateX}px, ${tryOnState.translateY}px, 0) scale(${tryOnState.scale}) rotate(${tryOnState.rotate}deg)`;
  }
}

function resetTryOnOverlay() {
  tryOnState.translateX = 0;
  tryOnState.translateY = 0;
  tryOnState.scale = 1.0;
  tryOnState.rotate = 0;
  
  const scaleSlider = document.getElementById("tryonScaleSlider");
  const rotateSlider = document.getElementById("tryonRotateSlider");
  
  if (scaleSlider) scaleSlider.value = 1.0;
  if (rotateSlider) rotateSlider.value = 0;
  
  updateTryOnTransform();
}

function toggleTryOnCamera() {
  const video = document.getElementById("tryonVideo");
  const bgImg = document.getElementById("tryonBgImage");
  const camBtn = document.getElementById("tryonCamBtn");
  
  if (tryOnState.isCameraOn) {
    stopTryOnCamera();
  } else {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        tryOnState.stream = stream;
        tryOnState.isCameraOn = true;
        
        if (video) {
          video.srcObject = stream;
          video.style.display = "block";
        }
        if (bgImg) {
          bgImg.style.display = "none";
        }
        if (camBtn) {
          camBtn.innerHTML = '<i class="fas fa-camera-retro"></i> Stop Live Camera';
          camBtn.classList.add("active");
        }
      })
      .catch(err => {
        console.error("Camera access failed:", err);
        alert("Unable to open camera. Please upload your photo instead.");
      });
  }
}

function stopTryOnCamera() {
  const video = document.getElementById("tryonVideo");
  const bgImg = document.getElementById("tryonBgImage");
  const camBtn = document.getElementById("tryonCamBtn");
  
  if (tryOnState.stream) {
    tryOnState.stream.getTracks().forEach(track => track.stop());
    tryOnState.stream = null;
  }
  
  tryOnState.isCameraOn = false;
  
  if (video) {
    video.srcObject = null;
    video.style.display = "none";
  }
  if (bgImg) {
    bgImg.style.display = "block";
  }
  if (camBtn) {
    camBtn.innerHTML = '<i class="fas fa-camera"></i> Use Live Camera';
    camBtn.classList.remove("active");
  }
}

function handleTryOnUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    // Stop live cam if it is active
    stopTryOnCamera();
    
    const bgImg = document.getElementById("tryonBgImage");
    if (bgImg) {
      bgImg.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

function captureTryOnSnapshot() {
  const container = document.getElementById("tryonCanvasContainer");
  const bgImg = document.getElementById("tryonBgImage");
  const video = document.getElementById("tryonVideo");
  const overlayImg = document.getElementById("tryonOverlayItem");
  const wrapper = document.getElementById("tryonOverlayWrapper");
  
  if (!container || !overlayImg || !wrapper) return;
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Standard try-on image resolution
  canvas.width = 640;
  canvas.height = 480;
  
  // 1. Draw backdrop (Video stream frame or static mockup image)
  if (tryOnState.isCameraOn && video) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  } else if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }
  
  // 2. Draw overlay jewelry
  const containerRect = container.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  const overlayImgRect = overlayImg.getBoundingClientRect();
  
  const scaleX = canvas.width / containerRect.width;
  const scaleY = canvas.height / containerRect.height;
  
  const relativeX = (wrapperRect.left - containerRect.left) * scaleX;
  const relativeY = (wrapperRect.top - containerRect.top) * scaleY;
  const relativeWidth = wrapperRect.width * scaleX;
  const relativeHeight = wrapperRect.height * scaleY;
  
  ctx.save();
  ctx.translate(relativeX + relativeWidth / 2, relativeY + relativeHeight / 2);
  ctx.rotate((tryOnState.rotate * Math.PI) / 180);
  
  const drawWidth = overlayImgRect.width * scaleX;
  const drawHeight = overlayImgRect.height * scaleY;
  
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  
  ctx.drawImage(overlayImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
  
  // 3. Initiate client-side download
  try {
    const link = document.createElement("a");
    link.download = `swarnalaya-tryon-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Screenshot capture failed:", err);
    alert("Sorry, screenshot download is not supported on this browser.");
  }
}

// ==========================================
// HERO VIDEO VOLUME CONTROLLER (NATIVE MP4)
// ==========================================

// Toggle volume and switch active button icons/styling
window.toggleHeroVolume = function() {
  const video = document.getElementById("tryonHeroVideo");
  const volumeBtn = document.getElementById("tryonVolumeToggle");
  if (!video) return;
  
  if (video.muted) {
    video.muted = false;
    if (volumeBtn) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      volumeBtn.classList.add("sound-on");
      volumeBtn.setAttribute("title", "Mute video");
    }
  } else {
    video.muted = true;
    if (volumeBtn) {
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      volumeBtn.classList.remove("sound-on");
      volumeBtn.setAttribute("title", "Unmute video");
    }
  }
};

window.toggleExplorerColumn = function(colName) {
  const col = document.getElementById("exp-" + colName);
  if (!col) return;
  
  const isActive = col.classList.contains("active");
  
  // Collapse all columns first
  const allCols = document.querySelectorAll(".explorer-col");
  allCols.forEach(c => {
    c.classList.remove("active");
    const icon = c.querySelector(".explorer-toggle-icon i");
    if (icon) {
      icon.className = "fas fa-plus";
    }
  });
  
  // If the clicked column was not active, expand it
  if (!isActive) {
    col.classList.add("active");
    const icon = col.querySelector(".explorer-toggle-icon i");
    if (icon) {
      icon.className = "fas fa-minus";
    }
  }
};

window.filterExplorerCatalog = function(itemName, categoryName, event) {
  if (event) event.preventDefault();
  
  // Find the tab button corresponding to the categoryName
  // Categories are: necklaces, earrings, rings, pendants
  let tabIdx = 0;
  if (categoryName === 'earrings') tabIdx = 1;
  else if (categoryName === 'rings') tabIdx = 2;
  else if (categoryName === 'pendants') tabIdx = 3;
  
  const tabs = document.querySelectorAll('.tryon-tab-btn');
  if (tabs && tabs[tabIdx]) {
    switchTryOnCategory(categoryName, tabs[tabIdx]);
  }
  
  // Find product with matching or similar name in tryOnProducts[categoryName]
  const products = tryOnProducts[categoryName] || [];
  const matchedProd = products.find(p => p.name.toUpperCase().includes(itemName.toUpperCase()) || itemName.toUpperCase().includes(p.name.toUpperCase())) || products[0];
  
  if (matchedProd) {
    selectTryOnProduct(matchedProd.src);
    showExplorerToast(`Selected ${matchedProd.name} from ${itemName} collection!`);
  } else {
    showExplorerToast(`Browsing the ${itemName} collection...`);
  }
};

function showExplorerToast(message) {
  let container = document.getElementById("explorerToastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "explorerToastContainer";
    container.style.cssText = "position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;";
    document.body.appendChild(container);
  }
  
  const toast = document.createElement("div");
  toast.style.cssText = "background: rgba(26, 95, 74, 0.95); color: #fff; border: 1px solid #c5a059; padding: 12px 24px; border-radius: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.25); backdrop-filter: blur(8px); transform: translateY(50px); opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center;";
  toast.innerText = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  }, 50);
  
  setTimeout(() => {
    toast.style.transform = "translateY(-20px)";
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// Global Activity Tracking Helper
window.logCustomerActivity = function(activityType, details = "") {
  try {
    const sessionData = localStorage.getItem("swarnalaya_auth_user");
    const user = sessionData ? JSON.parse(sessionData) : null;
    
    const payload = {
      activityType: activityType,
      details: details,
      page: window.location.pathname.split("/").pop() || "index.html",
      mobile: user ? user.phone : "",
      email: user ? user.email : ""
    };
    
    fetch("/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) console.warn("Activity tracking warning: HTTP status", res.status);
    }).catch(err => {
      console.warn("Activity tracking network error:", err);
    });
  } catch (e) {
    console.error("Activity tracking error:", e);
  }
};



