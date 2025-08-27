 $(document).ready(function() {
            // Function to display messages in specific message boxes
            function showMessage(targetId, type, text) {
                const messageBox = $(`#${targetId}`);
                messageBox.removeClass('success error').hide();
                messageBox.addClass(type).text(text).fadeIn(300);
            }

            // Function to set a cookie
            function setCookie(name, value, days) {
                let expires = "";
                if (days) {
                    const date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toUTCString();
                }
                document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
            }

            // Function to get a cookie
            function getCookie(name) {
                const nameEQ = name + "=";
                const ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            }


            // --- Toggle between Login and Sign Up Forms ---
            $('#showSignup').on('click', function(event) {
                event.preventDefault();
                $('#loginSection').fadeOut(300, function() {
                    $('#signupSection').fadeIn(300);
                    // Clear messages when switching forms
                    $('#loginMessage').hide();
                    $('#signupMessage').hide();
                    // Clear form inputs when switching
                    $('#loginForm')[0].reset();
                });
            });

            $('#showLogin').on('click', function(event) {
                event.preventDefault();
                $('#signupSection').fadeOut(300, function() {
                    $('#loginSection').fadeIn(300);
                    // Clear messages when switching forms
                    $('#loginMessage').hide();
                    $('#signupMessage').hide();
                    // Clear form inputs when switching
                    $('#signupForm')[0].reset();
                });
            });

            // --- Client-side validation for Login Form ---
            $('#loginEmail').on('input', function() {
                if ($(this).val().length > 0 && !$(this).val().includes('@')) {
                    this.setCustomValidity('Please enter a valid email address.');
                } else {
                    this.setCustomValidity('');
                }
            });

            $('#loginPassword').on('input', function() {
                if ($(this).val().length < 6) {
                    this.setCustomValidity('Password must be at least 6 characters long.');
                } else {
                    this.setCustomValidity('');
                }
            });

            // --- Handle Login Form Submission ---
            $('#loginForm').on('submit', function(event) {
                event.preventDefault();

                const email = $('#loginEmail').val();
                const password = $('#loginPassword').val();

                // Client-side validation
                if (!email || !password) {
                    showMessage('loginMessage', 'error', 'Please fill in both email and password.');
                    return;
                }
                if (!$('#loginEmail')[0].checkValidity()) {
                    showMessage('loginMessage', 'error', 'Please enter a valid email address.');
                    return;
                }
                if (!$('#loginPassword')[0].checkValidity()) {
                    showMessage('loginMessage', 'error', 'Password must be at least 6 characters long.');
                    return;
                }

                // Retrieve stored credentials from cookies
                const storedEmail = getCookie('registeredEmail');
                const storedPassword = getCookie('registeredPassword');

                // Simulate login success/failure based on stored cookies
                if (email === storedEmail && password === storedPassword) {
                    // If login is successful, set an authentication token cookie
                    setCookie('authToken', 'logged_in_token_' + Math.random().toString(36).substring(2, 15), 7);
                    showMessage('loginMessage', 'success', 'Login successful!');
                    setTimeout(() => {
                            window.location.href = 'homepage/index.html'; 
                    }, 500)
                   
                } else {
                    showMessage('loginMessage', 'error', 'Invalid email or password.');
                    
                }
            });

            // --- Client-side validation for Sign Up Form ---
            $('#signupEmail').on('input', function() {
                if ($(this).val().length > 0 && !$(this).val().includes('@')) {
                    this.setCustomValidity('Please enter a valid email address.');
                } else {
                    this.setCustomValidity('');
                }
            });

            $('#signupPassword').on('input', function() {
                const password = $(this).val();
                if (password.length < 6) {
                    this.setCustomValidity('Password must be at least 6 characters long.');
                } else {
                    this.setCustomValidity('');
                }
                // Also re-validate confirm password if password changes
                $('#confirmPassword').trigger('input');
            });

            $('#confirmPassword').on('input', function() {
                const password = $('#signupPassword').val();
                const confirmPassword = $(this).val();
                if (password !== confirmPassword) {
                    this.setCustomValidity('Passwords do not match.');
                } else {
                    this.setCustomValidity('');
                }
            });

            // --- Handle Sign Up Form Submission ---
            $('#signupForm').on('submit', function(event) {
                event.preventDefault();

                const email = $('#signupEmail').val();
                const password = $('#signupPassword').val();
                const confirmPassword = $('#confirmPassword').val();

                // Trigger validation checks
                $('#signupEmail')[0].checkValidity();
                $('#signupPassword')[0].checkValidity();
                $('#confirmPassword')[0].checkValidity();

                // If any input is invalid, show an error and return
                if (!email || !password || !confirmPassword) {
                    showMessage('signupMessage', 'error', 'Please fill in all fields.');
                    return;
                }
                if (!$(this)[0].checkValidity()) {
                     showMessage('signupMessage', 'error', 'Please correct the highlighted fields.');
                     return;
                }

                // Simulate signup success: store registered credentials in cookies
                setCookie('registeredEmail', email, 7);
                setCookie('registeredPassword', password, 7); // Store the password
                
                showMessage('signupMessage', 'success', 'Registration successful!');
              

                // After successful signup, switch to login form
                setTimeout(function() {
                    $('#showLogin').trigger('click'); // Automatically switch to login form
                    $('#loginEmail').val(email); // Pre-fill email in login form
                    $('#signupForm')[0].reset(); // Clear signup form
                }, 1000);
            });
        });