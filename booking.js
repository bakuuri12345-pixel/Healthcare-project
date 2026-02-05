// Booking Module
window.app = window.app || {};

// 1. GLOBAL VARIABLES & ELEMENTS
const form = document.getElementById("booking-form");
const bookName = document.getElementById("book-name");
const bookPhone = document.getElementById("book-phone");
const bookDoctor = document.getElementById("book-doctor");
const bookDate = document.getElementById("book-date");
const bookTime = document.getElementById("book-time");

let isvalidatedBookName = false;
let isvalidatedBookPhone = false;

const errorP = document.createElement("p");
errorP.style.cssText = "color:red; font-size:12px; margin-top:5px";

// 2. FORM LOGIC
if (form) {
    // Name Validation
    bookName.addEventListener("input", (e) => {
        const val = e.target.value;
        if (val.length >= 3 && val.length < 30 && !/[0-9]/.test(val)) {
            bookName.style.border = "4px solid green";
            isvalidatedBookName = true;
            errorP.remove();
        } else {
            bookName.style.border = "4px solid red";
            isvalidatedBookName = false;
            errorP.innerText = "name must be 3-30 chars, no numbers";
            bookName.parentElement.appendChild(errorP);
        }
    });

    // Phone Validation
    bookPhone.addEventListener("input", (e) => {
        const val = e.target.value;
        if (val > 610000000 && val <= 619999999) {
            bookPhone.style.border = "4px solid green";
            isvalidatedBookPhone = true;
            errorP.remove();
        } else {
            bookPhone.style.border = "4px solid red";
            isvalidatedBookPhone = false;
            errorP.innerText = "phone number should be 61XXXXXXXX";
            bookPhone.parentElement.appendChild(errorP);
        }
    });

    // Submit Handler
   // Submit Handler
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentUser = app.data.getCurrentUser(); 
    if (!currentUser) return alert("User not logged in");

    
    if (!isvalidatedBookName || !isvalidatedBookPhone) {
        return alert("Something is wrong with your input");
    }

    if (bookPhone.value.trim() !== String(currentUser.phone).trim()) {
        bookPhone.style.border = "4px solid red";
        errorP.innerText = "Please use the phone number associated with your account.";
        bookPhone.parentElement.appendChild(errorP);
        return alert("Phone number must match your registered account");
    }

    if (!bookDoctor.value || !bookDate.value || !bookTime.value) {
        return alert("All fields are required");
    }

    if (new Date(bookDate.value + 'T' + bookTime.value) < new Date()) {
        return alert("Cannot book in the past");
    }

    const doctor = app.data.doctors.find(d => d.id == bookDoctor.value);
    let [start, end] = doctor.hours ? doctor.hours.split(' - ') : [doctor.workingHours.start, doctor.workingHours.end];

    if (bookTime.value < start || bookTime.value > end) {
        return alert(`Doctor works between ${start} and ${end}`);
    }

    const bookings = app.data.getBookings();
    const docBookings = bookings.filter(b => b.doctorId == doctor.id && b.date == bookDate.value);

    if (docBookings.some(b => b.time == bookTime.value)) {
        return alert("This time slot is no longer available. Please select another time or check a different date.");
    }

    const toMin = t => parseInt(t.split(':')[0]) * 60 + parseInt(t.split(':')[1]);
    if (docBookings.some(b => Math.abs(toMin(b.time) - toMin(bookTime.value)) < 30)) {
        return alert("Please leave at least 30 minutes between appointments");
    }

    
    app.data.addBooking({
        id: Date.now().toString(),
        patientName: bookName.value.trim(),
        phone: bookPhone.value.trim(),
        doctorId: doctor.id,
        date: bookDate.value,
        time: bookTime.value,
        doctorName: doctor.name,
        spec: doctor.spec || doctor.specialization
    });

    alert(`Success! Your appointment with ${doctor.name} is secured. We will send you a reminder as your appointment approaches!`);
    app.booking.renderMyBookings();
    form.reset();

    // Reset Validation Styles
    bookName.style.border = '1px solid #ddd';
    bookPhone.style.border = '1px solid #ddd';
    isvalidatedBookName = false; 
    isvalidatedBookPhone = false;
});

}

// 3. APP HELPERS
app.booking = {
    init: () => {
        populateDoctors();
        app.booking.renderMyBookings();
    },

    renderMyBookings: () => {
        const list = document.getElementById('booking-list');
        const user = app.data.getCurrentUser();
        if (!list || !user) return;

        const myBookings = app.data.getBookings().filter(b => String(b.phone).trim() === String(user.phone).trim());

        list.innerHTML = myBookings.length ? myBookings.map(b => `
            <div class="card" style="margin-bottom:1rem; padding:1rem; display:flex; justify-content:space-between; align-items:center">
                <div>
                    <b>${b.doctorName}</b> <span class="badge">${b.spec}</span>
                    <div style="margin-top:5px"><i class="ph ph-calendar"></i> ${b.date} ${b.time}</div>
                </div>
                <button style="background:#ef4444; color:white; border:none; padding:0.5rem; border-radius:4px" 
                        onclick="app.booking.cancel('${b.id}')">Cancel</button>
            </div>
        `).join('') : 'No appointments booked yet.';
    },

    renderMyBookings: () => {
    const list = document.getElementById('booking-list');
    const user = app.data.getCurrentUser();
    if (!list || !user) return;

    const myBookings = app.data.getBookings().filter(b => String(b.phone).trim() === String(user.phone).trim());

    list.innerHTML = myBookings.length ? myBookings.map(b => `
        <div class="card" style="margin-bottom:1rem; padding:1rem; display:flex; justify-content:space-between; align-items:center">
            <div>
                <b>${b.doctorName}</b> <span class="badge">${b.spec}</span>
                <div style="margin-top:5px"><i class="ph ph-calendar"></i> ${b.date} ${b.time}</div>
                <div style="font-size: 0.85rem; color: #666; margin-top: 5px;">Patient: ${b.patientName}</div>
            </div>
            <button style="background:#ef4444; color:white; border:none; padding:0.5rem; border-radius:4px" 
                    onclick="app.booking.cancel('${b.id}')">Cancel</button>
        </div>
    `).join('') : 'No appointments booked yet.';
},

    cancel: (id) => {
        if (confirm("Are you sure you want to cancel this appointment?!")) {
            app.data.cancelBooking(id);
            app.booking.renderMyBookings();
        }
    }
};

function populateDoctors() {
    const select = document.getElementById('book-doctor');
    if (select) {
        select.innerHTML = '<option value="">Choose a specialist...</option>';
        app.data.doctors.forEach(d => select.add(new Option(`${d.name} (${d.spec})`, d.id)));
    }
}

// Global Render (for Doctors page)
const renderDoctors = () => {
    const grid = document.getElementById('doctors-grid');
    if (!grid) return;
    grid.innerHTML = app.data.doctors.map(d => `
        <div class="card doctor-card">
            <img src="${d.image}" alt="${d.name}">
            <div class="doctor-info">
                <h3>${d.name}</h3>
                <p>${d.spec}</p>
                <p><i class="ph-duotone ph-clock"></i> ${d.hours || (d.workingHours.start + ' - ' + d.workingHours.end)}</p>
                <button class="btn-primary" onclick="initiateBooking(${d.id})">Book Appointment</button>
            </div>
        </div>
    `).join('');
};

window.initiateBooking = (id) => {
    if (window.app?.router) app.router('booking');
    const select = document.getElementById('book-doctor');
    if (select) select.value = id;
};

document.addEventListener('DOMContentLoaded', () => {
    app.booking.init();
    renderDoctors();
});
