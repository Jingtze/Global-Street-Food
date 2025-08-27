 // Custom JavaScript for the card slider animation
        document.addEventListener('DOMContentLoaded', function() {
            const cardsWrapper = document.getElementById('countryCardsWrapper');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const cards = cardsWrapper.querySelectorAll('.col-custom-width'); 

            let currentIndex = 0;
            const cardsPerViewLarge = 2; 
            const cardsPerViewSmall = 1;
            let cardsPerView = cardsPerViewLarge; 

            // Function to update cardsPerView based on screen size
            function updateCardsPerView() {
                cardsPerView = window.innerWidth < 768 ? cardsPerViewSmall : cardsPerViewLarge;
            }

            // Function to update the slider's position and button states
            function updateSlider() {
                updateCardsPerView(); 

                if (cards.length === 0) { 
                    prevBtn.disabled = true;
                    nextBtn.disabled = true;
                    return;
                }

                // Get the accurate width of a single card element, including its padding from CSS
                // Use offsetWidth which includes padding and border
                const singleCardOffsetWidth = cards[0].offsetWidth; 

                // Get the margin-right applied to the cards
                const cardStyle = getComputedStyle(cards[0]);
                const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;

                // The total space one card "step" takes: its own width + its right margin
                const singleCardStepWidth = singleCardOffsetWidth + cardMarginRight;

                // Calculate the translation based on the current index and the effective width of one card step.
                const translationX = -currentIndex * singleCardStepWidth;
                cardsWrapper.style.transform = `translateX(${translationX}px)`;

                // Enable/disable buttons based on current index and total cards
                prevBtn.disabled = currentIndex === 0;

                // The next button should be disabled if we've reached the point where the last 'cardsPerView' are visible.
                // We consider the total width needed to display the last *full* set of cardsPerView.
                nextBtn.disabled = (currentIndex + cardsPerView) >= cards.length;
            }

            // Event listener for previous button
            prevBtn.addEventListener('click', () => {
                updateCardsPerView(); // Ensure current view mode
                // Move back by `cardsPerView` units, but not past the beginning (index 0).
                currentIndex = Math.max(0, currentIndex - cardsPerView);
                updateSlider();
            });

            // Event listener for next button
            nextBtn.addEventListener('click', () => {
                updateCardsPerView(); // Ensure current view mode
                // Calculate the maximum possible starting index for a complete set of `cardsPerView`.
                const maxStartIndex = cards.length - cardsPerView;
                // Move forward by `cardsPerView` units, but not past the maxStartIndex.
                currentIndex = Math.min(maxStartIndex, currentIndex + cardsPerView);
                updateSlider();
            });

            // Update slider on window resize to adjust for responsive design
            window.addEventListener('resize', () => {
                updateCardsPerView(); // Update the number of cards to show
                currentIndex = 0; // Reset index on resize to ensure correct alignment and prevent broken views
                updateSlider();
            });

            // Initial update when the page loads
            updateSlider();
        });

        const pageUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent('Do you like our website? Check out Global Street Food for amazing cuisines from around the world!');

            $('#shareFacebook').on('click', function() {
                const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${shareText}`;
                window.open(facebookShareUrl, '_blank', 'width=600,height=400');
            });