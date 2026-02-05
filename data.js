window.app = window.app || {};

window.app.data = {
    doctors: [
       {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialization: "Cardiology",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
            hours: "09:00 - 17:00",
            workingHours: { start: "09:00", end: "17:00" },
            icon: "ph-heartbeat",
            spec: "Cardiology"
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialization: "Dermatology",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
            hours: "09:00 - 18:00",
            workingHours: { start: "09:00", end: "18:00" },
            icon: "ph-bandaids",
            spec: "Dermatology"
        },
        {
            id: 3,
            name: "Dr. Emily Davis",
            specialization: "Pediatrics",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
            hours: "08:00 - 16:00",
            workingHours: { start: "08:00", end: "16:00" },
            icon: "ph-baby",
            spec: "Pediatrics"
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialization: "Neurology",
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
            hours: "08:00 - 15:00",
            workingHours: { start: "08:00", end: "15:00" },
            icon: "ph-brain",
            spec: "Neurology"
        },
        {
            id: 5,
            name: "Dr. Phill",
            specialization: "Dermatology",
            image: "https://www.alseef-hospital.com/wp-content/uploads/2024/12/web-images-of-Dr.-LUBOMIR-BALOUKOV1-76-768x768-1-300x300.png",
            hours: "08:00 - 18:00",
            workingHours: { start: "8:00", end: "18:00" },
            icon: "ph-bandaids",
            spec: "Dermatology"
        },
        {
            id: 6,
            name: "Dr. Ahmed Ali",
            specialization: "Orthopedics",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80",
            hours: "07:00 - 14:00",
            workingHours: { start: "07:00", end: "14:00" },
            icon: "ph-bone",
            spec: "Orthopedics"
        }
    ],

    getBookings: function () {
        return JSON.parse(localStorage.getItem('bookings')) || [];
    },

    addBooking: function (booking) {
        const bookings = this.getBookings();
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    },

    cancelBooking: function (id) {
        let bookings = this.getBookings();
        bookings = bookings.filter(b => b.id != id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    },

    getCurrentUser: function () {
        return JSON.parse(localStorage.getItem('user'));
    }
};

// Global alias for compatibility if needed elsewhere
const doctors = window.app.data.doctors;
