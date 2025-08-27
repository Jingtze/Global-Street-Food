document.addEventListener("DOMContentLoaded", function () {
  const ings = document.querySelectorAll(".ingredients .ing");

  function hide(el) {
    const p = el.querySelector(".ing-preview");
    if (p) p.remove();
  }

  function show(el) {
    hide(el); // clean existing
    const url = el.getAttribute("data-img");
    if (!url) return;

    const box = document.createElement("div");
    box.className = "ing-preview";

    const img = document.createElement("img");
    img.src = url;
    img.alt = el.textContent.trim();

    const cap = document.createElement("div");
    cap.className = "cap";
    cap.textContent = el.textContent.trim();

    box.appendChild(img);
    box.appendChild(cap);
    el.appendChild(box);
    // No JS positioning — CSS places it above & centered
  }

  ings.forEach((el) => {
    // Desktop hover
    el.addEventListener("mouseenter", () => show(el));
    el.addEventListener("mouseleave", () => hide(el));

    // Tap to toggle on mobile
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const open = el.querySelector(".ing-preview");
      if (open) hide(el);
      else show(el);
    }, { passive: false });
  });

  // Click anywhere else to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".ing")) {
      document.querySelectorAll(".ing-preview").forEach(n => n.remove());
    }
  });
});


// Smooth scroll to top
document.addEventListener("DOMContentLoaded", () => {
  const topBtn = document.getElementById("backToTop");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  initEatenFeature();
});

function initEatenFeature() {
  const cards = document.querySelectorAll(".food-card");
  let eatenFoods = JSON.parse(localStorage.getItem("eatenFoodsJapan")) || {};

  // Apply saved state
  cards.forEach(card => {
    const foodId = getFoodId(card);
    if (eatenFoods[foodId]) {
      card.classList.add("eaten");
    }

    // Double-click to toggle eaten
    card.addEventListener("dblclick", () => {
      if (card.classList.contains("eaten")) {
        card.classList.remove("eaten");
        delete eatenFoods[foodId];
      } else {
        card.classList.add("eaten");
        eatenFoods[foodId] = true;
      }
      localStorage.setItem("eatenFoodsJapan", JSON.stringify(eatenFoods));
      updateEatenList();
    });
  });

  updateEatenList();
}

function getFoodId(card) {
  const title = card.querySelector(".card-title");
  return title ? title.textContent.trim() : "Unknown";
}

function updateEatenList() {
  const eatenList = document.getElementById("eaten-list");
  eatenList.innerHTML = "";

  let eatenFoods = JSON.parse(localStorage.getItem("eatenFoodsJapan")) || {};
  const cards = document.querySelectorAll(".food-card");

  const eatenItems = Object.keys(eatenFoods).map(foodId => {
    const card = Array.from(cards).find(c => getFoodId(c) === foodId);
    return card ? getFoodId(card) : null;
  }).filter(Boolean);

  if (eatenItems.length === 0) {
    eatenList.innerHTML = `<li class="list-group-item">Not eaten yet</li>`;
  } else {
    eatenItems.forEach(name => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = name;
      eatenList.appendChild(li);
    });
  }
}
