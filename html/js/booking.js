// Booking System JavaScript

// Constants
const BOOKING_STORAGE_KEY = 'trator_bookings';
const VEHICLE_STORAGE_KEY = 'trator_vehicles';

// Global variables
let selectedVehicle = null;
let currentUser = null;

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Ensure we have vehicle data
    ensureVehicleData();
    
    // Load vehicle data from URL parameter
    loadVehicleFromURL();
    
    // Set up form event listeners
    setupFormListeners();
    
    // Set minimum dates
    setMinimumDates();
    
    // Auto-fill user data if logged in
    autoFillUserData();
});

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
        alert('Silahkan login terlebih dahulu untuk melakukan pemesanan!');
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    updateNavbar();
}

// Update navbar based on login status
function updateNavbar() {
    if (currentUser) {
        document.getElementById('loginNavItem').style.display = 'none';
        document.getElementById('userNavItem').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
    }
}

// Load vehicle data from URL parameter
function loadVehicleFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    
    console.log('Booking.js - Vehicle ID from URL:', vehicleId);
    console.log('Booking.js - Vehicle ID type:', typeof vehicleId);
    
    if (!vehicleId) {
        showError('ID mobil tidak ditemukan! Silahkan pilih mobil dari halaman vehicles.');
        showEmptyState();
        return;
    }
    
    // Get vehicle data from localStorage
    const vehicles = getVehicles();
    console.log('Booking.js - Total vehicles found:', vehicles.length);
    console.log('Booking.js - Available vehicle IDs:', vehicles.map(v => ({ id: v.id, type: typeof v.id, name: v.name })));
    
    // Try to find vehicle by exact ID match first
    selectedVehicle = vehicles.find(v => v.id == vehicleId);
    console.log('Booking.js - Exact match result:', selectedVehicle);
    
    // If not found, try to find by string comparison (for different ID formats)
    if (!selectedVehicle) {
        console.log('Booking.js - Exact match not found, trying string comparison...');
        selectedVehicle = vehicles.find(v => String(v.id) === String(vehicleId));
        console.log('Booking.js - String comparison result:', selectedVehicle);
    }
    
    // If still not found, try to find by name (fallback)
    if (!selectedVehicle) {
        console.log('Booking.js - String comparison failed, trying to find by name...');
        // Extract name from URL if possible, or use first available vehicle
        const vehicleName = urlParams.get('name');
        if (vehicleName) {
            selectedVehicle = vehicles.find(v => v.name.toLowerCase().includes(vehicleName.toLowerCase()));
            console.log('Booking.js - Name search result:', selectedVehicle);
        }
    }
    
    // If still not found, try to find by partial ID match
    if (!selectedVehicle) {
        console.log('Booking.js - Name search failed, trying partial ID match...');
        selectedVehicle = vehicles.find(v => String(v.id).includes(String(vehicleId)) || String(vehicleId).includes(String(v.id)));
        console.log('Booking.js - Partial ID match result:', selectedVehicle);
    }
    
    console.log('Booking.js - Final selected vehicle:', selectedVehicle);
    
    if (!selectedVehicle) {
        showError(`Data mobil dengan ID ${vehicleId} tidak ditemukan! Silahkan pilih mobil yang tersedia.`);
        showEmptyState();
        return;
    }
    
    // Check if vehicle is available
    const isAvailable = selectedVehicle.status === 'available' || selectedVehicle.available === true;
    console.log('Booking.js - Vehicle available:', isAvailable);
    
    if (!isAvailable) {
        showError('Mobil tidak tersedia untuk dipesan! Silahkan pilih mobil lain.');
        showEmptyState();
        return;
    }
    
    // Update vehicle preview
    updateVehiclePreview();
}

// Get vehicles from localStorage
function getVehicles() {
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    console.log('Booking.js - localStorage data:', local);
    
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                console.log('Booking.js - Data dari localStorage:', parsedData.length, 'mobil');
                console.log('Booking.js - Sample vehicle:', parsedData[0]);
                return parsedData;
            }
        } catch (e) {
            console.error('Error parsing vehicle data:', e);
        }
    }
    
    // Fallback ke data.js jika localStorage kosong
    if (window.vehicles && window.vehicles.length > 0) {
        console.log('Booking.js - Fallback ke data.js:', window.vehicles.length, 'mobil');
        console.log('Booking.js - Sample vehicle from data.js:', window.vehicles[0]);
        
        // Copy data.js ke localStorage untuk konsistensi
        try {
            localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(window.vehicles));
            console.log('Booking.js - Data copied to localStorage');
        } catch (e) {
            console.error('Error copying data to localStorage:', e);
        }
        
        return window.vehicles;
    }
    
    console.log('Booking.js - Tidak ada data mobil tersedia');
    return [];
}

// Update vehicle preview
function updateVehiclePreview() {
    if (!selectedVehicle) return;
    
    document.getElementById('vehicleImage').src = selectedVehicle.image;
    document.getElementById('vehicleName').textContent = selectedVehicle.name;
    document.getElementById('vehicleDetails').textContent = `${selectedVehicle.brand} • ${selectedVehicle.year} • ${selectedVehicle.type.toUpperCase()}`;
    document.getElementById('vehiclePrice').textContent = formatCurrency(selectedVehicle.price);
}

// Set up form event listeners
function setupFormListeners() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const bookingForm = document.getElementById('bookingForm');
    
    // Date change listeners
    startDate.addEventListener('change', function() {
        validateDates();
        calculateBooking();
    });
    
    endDate.addEventListener('change', function() {
        validateDates();
        calculateBooking();
    });
    
    // Form submit listener
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
    
    // Real-time validation
    const inputs = bookingForm.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Set minimum dates
function setMinimumDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    startDate.min = tomorrow.toISOString().split('T')[0];
    endDate.min = tomorrow.toISOString().split('T')[0];
}

// Auto-fill user data if logged in
function autoFillUserData() {
    if (!currentUser) return;
    
    document.getElementById('customerName').value = currentUser.name || '';
    document.getElementById('customerEmail').value = currentUser.email || '';
    document.getElementById('customerPhone').value = currentUser.phone || '';
    document.getElementById('customerAddress').value = currentUser.address || '';
}

// Validate dates
function validateDates() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (!startDate.value || !endDate.value) return;
    
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Clear previous errors
    clearFieldError(startDate);
    clearFieldError(endDate);
    
    let hasError = false;
    
    // Check if start date is today or in the past
    if (start <= today) {
        showFieldError(startDate, 'Tanggal mulai harus minimal besok');
        hasError = true;
    }
    
    // Check if end date is before start date
    if (end <= start) {
        showFieldError(endDate, 'Tanggal selesai harus setelah tanggal mulai');
        hasError = true;
    }
    
    // Check if booking duration is too long (max 30 days)
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
        showFieldError(endDate, 'Maksimal pemesanan 30 hari');
        hasError = true;
    }
    
    return !hasError;
}

// Calculate booking
function calculateBooking() {
    if (!selectedVehicle || !validateDates()) {
        hideBookingSummary();
        return;
    }
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (!startDate.value || !endDate.value) {
        hideBookingSummary();
        return;
    }
    
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const pricePerDay = selectedVehicle.price;
    const totalPrice = diffDays * pricePerDay;
    
    // Update summary
    document.getElementById('summaryDuration').textContent = `${diffDays} hari`;
    document.getElementById('summaryPricePerDay').textContent = formatCurrency(pricePerDay);
    document.getElementById('summaryTotal').textContent = formatCurrency(totalPrice);
    
    // Show summary
    document.getElementById('bookingSummary').style.display = 'block';
}

// Hide booking summary
function hideBookingSummary() {
    document.getElementById('bookingSummary').style.display = 'none';
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    if (!value && field.hasAttribute('required')) {
        showFieldError(field, 'Field ini wajib diisi');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Format email tidak valid');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Format nomor telepon tidak valid');
            return false;
        }
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

// Show general error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 8 seconds
    setTimeout(() => { 
        if (errorDiv.parentNode) errorDiv.remove(); 
    }, 8000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => { if (successDiv.parentNode) successDiv.remove(); }, 5000);
}

// Submit booking
function submitBooking() {
    // Validate all required fields
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showError('Mohon lengkapi semua field yang wajib diisi!');
        return;
    }
    
    if (!validateDates()) {
        showError('Tanggal pemesanan tidak valid!');
        return;
    }
    
    // Get form data
    const formData = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        customerName: document.getElementById('customerName').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerAddress: document.getElementById('customerAddress').value.trim(),
        bookingNotes: document.getElementById('bookingNotes').value.trim()
    };
    
    // Calculate booking details
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Create booking object
    const booking = {
        id: 'b' + Date.now(),
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        customerId: currentUser.id || currentUser.email,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: diffDays,
        pricePerDay: selectedVehicle.price,
        totalPrice: diffDays * selectedVehicle.price,
        status: 'pending',
        bookingDate: new Date().toISOString(),
        notes: formData.bookingNotes
    };
    
    // Save booking
    saveBooking(booking);
    
    // Update vehicle status
    updateVehicleStatus(selectedVehicle.id, 'rented');
    
    // Show success and redirect
    showSuccess('Pemesanan berhasil! Anda akan diarahkan ke halaman pemesanan Anda.');
    setTimeout(() => {
        window.location.href = 'my-bookings.html';
    }, 2000);
}

// Save booking to localStorage
function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

// Get bookings from localStorage
function getBookings() {
    const local = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            if (parsedData && Array.isArray(parsedData)) {
                return parsedData;
            }
        } catch (e) {
            console.error('Error parsing booking data:', e);
        }
    }
    return [];
}

// Update vehicle status
function updateVehicleStatus(vehicleId, status) {
    const vehicles = getVehicles();
    const updatedVehicles = vehicles.map(v => {
        if (v.id == vehicleId) {
            return {
                ...v,
                status: status,
                available: status === 'available'
            };
        }
        return v;
    });
    localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(updatedVehicles));
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Show empty state
function showEmptyState() {
    const bookingForm = document.getElementById('bookingForm');
    const vehiclePreview = document.getElementById('vehiclePreview');
    
    if (bookingForm) bookingForm.style.display = 'none';
    if (vehiclePreview) vehiclePreview.style.display = 'none';
    
    // Show empty state message
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-car fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">Mobil Tidak Ditemukan</h4>
            <p class="text-muted mb-4">Silahkan pilih mobil yang tersedia dari halaman vehicles.</p>
            <a href="vehicles.html" class="btn btn-primary">
                <i class="fas fa-arrow-left"></i> Kembali ke Vehicles
            </a>
        </div>
    `;
    
    document.querySelector('.container').appendChild(emptyState);
}

// Ensure vehicle data is available
function ensureVehicleData() {
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    
    if (!local && window.vehicles && window.vehicles.length > 0) {
        console.log('Booking.js - No localStorage data, copying from data.js...');
        try {
            localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(window.vehicles));
            console.log('Booking.js - Data copied to localStorage successfully');
        } catch (e) {
            console.error('Booking.js - Error copying data to localStorage:', e);
        }
    }
} 