window.onload = function() {
            const foodCardsContainer = document.getElementById('food-cards-container');
            const initialFoodCards = Array.from(document.querySelectorAll('.food-card'));
            const commentForm = document.getElementById('comment-form');
            const commentsList = document.getElementById('comments-list');

            // --- Tab Switching Logic ---
            function setupTabAddressing(card) {
                const tabButtons = card.querySelectorAll('.tab-button');
                const tabPanes = card.querySelectorAll('.tab-pane');

                // Reset all tabs to inactive and then activate the first one
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                if (tabButtons.length > 0 && tabPanes.length > 0) {
                    tabButtons[0].classList.add('active');
                    tabPanes[0].classList.add('active');
                }

                tabButtons.forEach(button => {
                    button.removeEventListener('click', handleTabClick); // Prevent duplicate listeners
                    button.addEventListener('click', handleTabClick);
                });
            }

            function handleTabClick() {
                const card = this.closest('.food-card');
                const tabButtons = card.querySelectorAll('.tab-button');
                const tabPanes = card.querySelectorAll('.tab-pane');
                const targetTabId = this.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(targetTabId).classList.add('active');
            }

            // --- Like Functionality Logic ---
            function loadLikes() {
                const likedFoods = JSON.parse(localStorage.getItem('likedFoods')) || {};
                initialFoodCards.forEach(card => {
                    const foodId = card.dataset.foodId;
                    const likeButton = card.querySelector('.like-button');
                    if (likedFoods[foodId]) {
                        likeButton.classList.add('liked');
                        likeButton.textContent = '❤️';
                    } else {
                        likeButton.classList.remove('liked');
                        likeButton.textContent = '♡';
                    }
                });
            }

            function saveLike(foodId, isLiked) {
                const likedFoods = JSON.parse(localStorage.getItem('likedFoods')) || {};
                if (isLiked) {
                    likedFoods[foodId] = true;
                } else {
                    delete likedFoods[foodId];
                }
                localStorage.setItem('likedFoods', JSON.stringify(likedFoods));
            }

            function handleLikeButtonClick() {
                const foodId = this.dataset.foodId;
                const isCurrentlyLiked = this.classList.contains('liked');

                if (isCurrentlyLiked) {
                    this.classList.remove('liked');
                    this.textContent = '♡';
                    saveLike(foodId, false);
                } else {
                    this.classList.add('liked');
                    this.textContent = '❤️';
                    saveLike(foodId, true);
                }
            }

            function reorderCards() {
                const likedFoods = JSON.parse(localStorage.getItem('likedFoods')) || {};
                let likedCards = [];
                let unlikedCards = [];

                const currentFoodCardsInDom = Array.from(document.querySelectorAll('.food-card'));

                currentFoodCardsInDom.forEach(card => {
                    const foodId = card.dataset.foodId;
                    if (likedFoods[foodId]) {
                        likedCards.push(card);
                    } else {
                        unlikedCards.push(card);
                    }
                });

                foodCardsContainer.innerHTML = ''; // Clear existing cards

                likedCards.forEach(card => foodCardsContainer.appendChild(card));
                unlikedCards.forEach(card => foodCardsContainer.appendChild(card));

                // Re-apply event listeners after reordering
                document.querySelectorAll('.food-card').forEach(card => setupTabAddressing(card));
                document.querySelectorAll('.like-button').forEach(button => {
                    button.removeEventListener('click', handleLikeButtonClick);
                    button.addEventListener('click', handleLikeButtonClick);
                });
            }

            // --- Comment Section Logic ---
            function loadComments() {
                let comments = JSON.parse(localStorage.getItem('vietnamStreetFoodComments')) || [];
                commentsList.innerHTML = ''; // Clear current list

                // Get only the latest 6 comments
                const latestComments = comments.slice(-6);
                latestComments.reverse().forEach(comment => { // Reverse to show newest first among these 6
                    const commentItem = document.createElement('div');
                    commentItem.classList.add('comment-item');
                    commentItem.innerHTML = `
                        <strong>Name: ${comment.name}</strong>
                        <p>${comment.text}</p>
                        <small class="comment-timestamp">${new Date(comment.timestamp).toLocaleString()}</small>
                    `;
                    commentsList.appendChild(commentItem);
                });
            }

            function saveComment(name, text) {
                const comments = JSON.parse(localStorage.getItem('vietnamStreetFoodComments')) || [];
                const newComment = {
                    name: name,
                    text: text,
                    timestamp: new Date().toISOString()
                };
                comments.push(newComment);
                localStorage.setItem('vietnamStreetFoodComments', JSON.stringify(comments));
                loadComments(); // Reload comments to show the new one
            }

            commentForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent default form submission
                const commenterName = document.getElementById('commenter-name').value;
                const commentText = document.getElementById('comment-text').value;

                if (commenterName.trim() === '' || commentText.trim() === '') {
                    // Using a custom alert or modal would be better in a real app
                    alert('Please fill in both your name and comment.');
                    return;
                }

                saveComment(commenterName, commentText);

                // Clear the form fields
                document.getElementById('commenter-name').value = '';
                document.getElementById('comment-text').value = '';
            });


            // --- Initial Setup on Page Load ---
            loadLikes(); // Load liked states for heart icons
            reorderCards(); // Reorder cards based on likes (and re-applies event listeners)
            loadComments(); // Load and display existing comments
        };