// DOM Elements
const registerForm = document.getElementById('register-form');
const ageInput = document.getElementById('age'); 
const fullnameInput = document.getElementById('fullname');
const phoneNumberInput = document.getElementById('phoneNumber');
const passwordInput = document.getElementById('password');

// Flags
let isvalidatedAge = false;

// إعداد عنصر رسالة الخطأ للعمر
const ageError = document.createElement("p");
ageError.className = 'error-message';
ageError.style.color = 'red';
ageError.style.fontSize = '12px';
ageError.style.marginTop = '5px';

// منطق التحقق من العمر (مثل بقية الحقول)
if (ageInput) {
    ageInput.addEventListener("input", (event) => {
        const myAge = parseInt(event.target.value);
        
        if (!isNaN(myAge) && myAge >= 18 && myAge <= 100) {
            // حالة النجاح
            isvalidatedAge = true;
            ageInput.style.border = "4px solid green";
            if (ageError.parentNode) ageError.remove(); // إزالة النص الأحمر
        } else {
            // حالة الخطأ
            isvalidatedAge = false;
            ageInput.style.border = "4px solid red";
            ageError.innerText = "Sorry, you must be at least 18 years old to register.";
            // إظهار النص الأحمر تحت الحقل مباشرة
            ageInput.parentElement.appendChild(ageError);
        }
    });
}

// تعديل الـ Submit Handler للتأكد من فحص الـ isvalidatedAge
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        if (!isvalidatedAge) {
            event.preventDefault(); // منع الإرسال
            alert("Please enter a valid age (18 or older)");
            ageInput.style.border = "4px solid red";
        }
        // ... باقي منطق الحفظ الخاص بك
    });
}
