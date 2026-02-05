// Contact Form Logic

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation visualization (browser standard 'required' handle empty fields)
        // Here we just simulate sending

        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.border = '1px solid red';
            } else {
                input.style.border = '1px solid #ddd';
            }
        });

        if (isValid) {
            alert('Message Sent Successfully! We will contact you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}
