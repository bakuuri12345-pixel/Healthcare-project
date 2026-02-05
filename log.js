// DOM Elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const fullnameInput = document.getElementById('fullname');
const phoneNumberInput = document.getElementById('phoneNumber');
const ageInput = document.getElementById('age');
const passwordInput = document.getElementById('password');

const loginPhoneInput = document.getElementById('login-phone');
const loginPassInput = document.getElementById('login-pass');

// Flags
let isvalidatedFullname = false;
let isvalidatedPhoneNumber = false;
let isvalidatedAge = false;
let isvalidatedPassword = false;

// Shared Error Paragraphs
const nameError = document.createElement("p");
const phoneError = document.createElement("p");
const ageError = document.createElement("p");
const passError = document.createElement("p");

[nameError, phoneError, ageError, passError].forEach(p => {
    p.className = 'error-message';
    p.style.color = 'red';
    p.style.fontSize = '12px';
    p.style.marginTop = '5px';
});

// Helper to show/hide feedback
function applyFeedback(inputElement, isValid, message, errorElement) {
    if (!inputElement) return;
    if (isValid) {
        inputElement.style.border = "2px solid green";
        if (errorElement.parentNode) errorElement.remove();
    } else {
        inputElement.style.border = "2px solid red";
        errorElement.innerText = message;
        inputElement.parentElement.appendChild(errorElement);
    }
}

// 1. Full Name Validation
fullnameInput.addEventListener("input", (e) => {
    const val = e.target.value;
    isvalidatedFullname = val.length >= 3 && val.length < 30 && (!/[0-9]/.test(val));
    applyFeedback(fullnameInput, isvalidatedFullname, "Name must be 3-30 chars and no numbers", nameError);
});

// 2. Phone Number Validation
phoneNumberInput.addEventListener("input", (e) => {
    const val = e.target.value;
    isvalidatedPhoneNumber = val >= 610000000 && val <= 619999999;
    applyFeedback(phoneNumberInput, isvalidatedPhoneNumber, "Phone should start with 61 (9 digits)", phoneError);
});

// 3. Age Validation (FIXED)
ageInput.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    isvalidatedAge = !isNaN(val) && val >= 18 && val <= 100;
    applyFeedback(ageInput, isvalidatedAge, "Sorry, you must be at least 18 years old", ageError);
});

// 4. Password Validation
passwordInput.addEventListener("input", (e) => {
    const val = e.target.value;
    isvalidatedPassword = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val);
    applyFeedback(passwordInput, isvalidatedPassword, "Min 8 chars, 1 Uppercase, 1 Number", passError);
});

// Submit Handler
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isvalidatedFullname && isvalidatedPhoneNumber && isvalidatedAge && isvalidatedPassword) {
        const userData = {
            fullname: fullnameInput.value,
            phone: phoneNumberInput.value,
            age: ageInput.value,
            password: passwordInput.value
        };
        localStorage.setItem('user', JSON.stringify(userData));
        alert("Success! Now you can Login.");
        toggleForm('login');
        registerForm.reset();
    } else {
        alert("Please fix the errors in red before submitting.");
    }
});

// Login Logic
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const phone = loginPhoneInput.value;
    const pass = loginPassInput.value;

    if (savedUser && savedUser.phone === phone && savedUser.password === pass) {
        alert("Welcome, " + savedUser.fullname);
        // Redirect or show home page
    } else {
        const err = document.getElementById('login-error');
        err.innerText = "Invalid phone or password";
        err.style.display = 'block';
    }
});

// Toggle Function
function toggleForm(mode) {
    const regSec = document.getElementById('register');
    const logSec = document.getElementById('login');
    if (mode === 'login') {
        regSec.classList.add('hidden');
        logSec.classList.remove('hidden');
    } else {
        regSec.classList.remove('hidden');
        logSec.classList.add('hidden');
    }
}
