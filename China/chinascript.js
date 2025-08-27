// Reveal animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

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

  