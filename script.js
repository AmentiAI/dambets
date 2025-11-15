// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signupBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const submitBtn = form.querySelector('.submit-btn');

    // Open modal
    signupBtn.addEventListener('click', function() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    });

    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const svg = this.querySelector('svg');
            if (input.type === 'password') {
                input.type = 'text';
                // Change to eye-off icon
                svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            } else {
                input.type = 'password';
                // Change back to eye icon
                svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            }
        });
    });

    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        if (password.length > 0) {
            strengthFill.classList.add(strength.level);
            strengthText.textContent = strength.text;
        } else {
            strengthText.textContent = 'Power level';
        }
    });

    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) {
            return { level: 'weak', text: 'Mortal Power' };
        } else if (strength <= 3) {
            return { level: 'medium', text: 'Demonic Strength' };
        } else {
            return { level: 'strong', text: 'Eternal Power' };
        }
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value && passwordInput.value) {
            validateField(this);
        }
    });

    function validateField(field) {
        const errorMessage = field.closest('.form-group').querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove previous error styling
        field.classList.remove('error');
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (field.id === 'password' && field.value) {
            if (field.value.length < 8) {
                isValid = false;
                message = 'Password must be at least 8 characters';
            }
        }

        // Confirm password validation
        if (field.id === 'confirmPassword' && field.value) {
            if (field.value !== passwordInput.value) {
                isValid = false;
                message = 'Passwords do not match';
            }
        }

        // Username validation
        if (field.id === 'username' && field.value) {
            if (field.value.length < 3) {
                isValid = false;
                message = 'Username must be at least 3 characters';
            }
            if (!/^[a-zA-Z0-9_]+$/.test(field.value)) {
                isValid = false;
                message = 'Username can only contain letters, numbers, and underscores';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }

        return isValid;
    }

    // Terms checkbox validation
    const termsCheckbox = document.getElementById('terms');
    termsCheckbox.addEventListener('change', function() {
        const errorMessage = this.closest('.form-group').querySelector('.error-message');
        if (!this.checked) {
            errorMessage.textContent = 'You must agree to the terms';
            errorMessage.classList.add('show');
        } else {
            errorMessage.classList.remove('show');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        // Validate terms checkbox
        if (!termsCheckbox.checked) {
            isFormValid = false;
            const errorMessage = termsCheckbox.closest('.form-group').querySelector('.error-message');
            errorMessage.textContent = 'You must agree to the terms';
            errorMessage.classList.add('show');
        }

        if (!isFormValid) {
            // Shake animation for invalid form
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call
        try {
            await simulateSignup({
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            });

            // Success animation
            document.querySelector('.modal-container').classList.add('success');
            
            // Show success message and close modal
            setTimeout(() => {
                alert('Your soul has been bound! Welcome to The Damned Bets! 🎲');
                closeModal();
                form.reset();
                // In a real app, you would redirect here:
                // window.location.href = '/dashboard';
            }, 500);

        } catch (error) {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message show';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.marginTop = '16px';
            errorDiv.textContent = error.message || 'Something went wrong. Please try again.';
            form.appendChild(errorDiv);

            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Simulate API call
    function simulateSignup(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true, data });
                } else {
                    reject(new Error('Network error. Please try again.'));
                }
            }, 2000);
        });
    }

    // Social button handlers
    document.querySelector('.social-btn.google').addEventListener('click', function() {
        alert('Google sign-in would be integrated here');
    });

    document.querySelector('.social-btn.github').addEventListener('click', function() {
        alert('GitHub sign-in would be integrated here');
    });

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .signup-form.shake {
            animation: shake 0.5s ease;
        }
        .input-wrapper input.error {
            border-color: var(--crimson) !important;
            animation: shake 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
