// Function to show/hide the details when clicking a food item
//'element' is the div with class 'food-item' that was clicked
function toggleDetails(element) {
    const details = element.querySelector(".food-details"); // find the hidden details inside
    if (details.style.display === "block") {
        details.style.display = "none"; // hide if already shown
    } else {
        details.style.display = "block"; // show if hidden
    }
}


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', function () {
    const scrollBtn = document.getElementById('scrollBtn');
    if (window.pageYOffset > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

// Process food selection and save to localStorage
document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll(".food-checkbox");
    const list = document.getElementById("selectedFoodsList");

    // Loading data from localStorage
    let selectedFoods = JSON.parse(localStorage.getItem("selectedFoods")) || [];

    foodList();

    checkboxes.forEach(cb => {

        if (selectedFoods.includes(cb.value)) {
            cb.checked = true;
        }

        cb.addEventListener("change", function () {
            if (cb.checked) {
                if (!selectedFoods.includes(cb.value)) {
                    selectedFoods.push(cb.value);
                }
            } else {
                selectedFoods = selectedFoods.filter(f => f !== cb.value);
            }

            // store into localStorage
            localStorage.setItem("selectedFoods", JSON.stringify(selectedFoods));

            foodList();
        });
    });

    // update and show the selected food
    function foodList() {
        list.innerHTML = "";
        if (selectedFoods.length === 0) {
            list.innerHTML = "<li>No food selected yet!</li>";
        } else {
            selectedFoods.forEach(food => {
                const li = document.createElement("li");
                li.textContent = food;
                list.appendChild(li);
            });
        }
    }
});