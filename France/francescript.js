 // Reveal animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));


    document.querySelectorAll(".food-item.hidden").forEach(el => observer.observe(el));
    // Hover & Click Expand/Shrink
    const rows = document.querySelectorAll('.food-row');
    rows.forEach(row => {
      const items = row.querySelectorAll('.food-item');
      items.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
          if (item.classList.contains('locked')) return;
          item.classList.add('hovered');
          items.forEach((sibling, i) => {
            if (i !== index) sibling.classList.add('shrink');
          });
        });

        item.addEventListener('mouseleave', () => {
          if (item.classList.contains('locked')) return;
          item.classList.remove('hovered');
          items.forEach(sibling => sibling.classList.remove('shrink'));
        });

        item.addEventListener('click', () => {
          const isLocked = item.classList.contains('locked');
          items.forEach(el => el.classList.remove('locked', 'hovered', 'shrink'));
          if (!isLocked) {
            item.classList.add('locked');
            items.forEach(sibling => {
              if (sibling !== item) sibling.classList.add('shrink');
            });
          }
        });
      });
    });

    // Back to top button
    document.getElementById("backToTop").addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Dark mode toggle
    const toggleBtn = document.getElementById("themeToggle");
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggleBtn.textContent = "Light Mode";
    }
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "Light Mode";
      } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "Dark Mode";
      }
    });