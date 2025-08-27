// showing/hiding side navigation
window.addEventListener('scroll', function () {
    const sideNav = document.getElementById('sideNav');
    const header = document.querySelector('.header');
    const headerBottom = header.offsetTop + header.offsetHeight;

    if (window.scrollY > headerBottom - 100) {
        sideNav.classList.add('show');
    } else {
        sideNav.classList.remove('show');
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