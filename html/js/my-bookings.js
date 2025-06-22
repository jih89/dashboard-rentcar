// My Bookings JavaScript

// Constants
const BOOKING_STORAGE_KEY = 'trator_bookings';

// Global variables
let currentUser = null;
let allBookings = [];
let filteredBookings = [];

// Initialize my bookings page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Load bookings data
    loadBookings();
    
    // Set up event listeners
    setupEventListeners();
});

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
        alert('Silahkan login terlebih dahulu!');
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

// Load bookings data
function loadBookings() {
    allBookings = getBookings();
    
    // Filter bookings for the current user
    filteredBookings = allBookings.filter(booking => booking.userId === currentUser.id);
    
    updateStatistics();
    renderBookings();
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

// Update statistics
function updateStatistics() {
    const pending = filteredBookings.filter(b => b.status === 'pending').length;
    const accepted = filteredBookings.filter(b => b.status === 'accepted').length;
    const finished = filteredBookings.filter(b => b.status === 'finished').length;
    const total = filteredBookings.length;
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('activeCount').textContent = accepted;
    document.getElementById('completedCount').textContent = finished;
    document.getElementById('totalCount').textContent = total;
}

// Render bookings
function renderBookings() {
    const bookingsList = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredBookings.length === 0) {
        bookingsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    bookingsList.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Sort bookings by booking date (newest first)
    const sortedBookings = [...filteredBookings].sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
    );
    
    let html = '';
    
    sortedBookings.forEach(booking => {
        html += createBookingCard(booking);
    });
    
    bookingsList.innerHTML = html;
}

// Create booking card HTML
function createBookingCard(booking) {
    const vehicles = getVehicles();
    const vehicle = vehicles.find(v => v.id == booking.vehicleId);

    const statusText = getStatusText(booking.status);
    const statusClass = booking.status;
    const canCancel = booking.status === 'pending';

    return `
        <div class="booking_card" data-booking-id="${booking.id}">
            <div class="booking_header">
                <div class="booking_info">
                    <h4>${vehicle ? vehicle.name : 'Mobil tidak diketahui'}</h4>
                    <p>Booking ID: ${booking.id}</p>
                </div>
                <span class="booking_status ${statusClass}">${statusText}</span>
            </div>
            
            <div class="booking_details">
                 <div class="detail_item">
                    <i class="fas fa-calendar"></i>
                    <span>Tanggal Sewa: <strong>${formatDate(booking.bookingDates.start)} - ${formatDate(booking.bookingDates.end)}</strong></span>
                </div>
                <div class="detail_item">
                    <i class="fas fa-clock"></i>
                    <span>Durasi: <strong>${booking.totalDays} hari</strong></span>
                </div>
                <div class="detail_item">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>Total: <strong>${formatCurrency(booking.totalPrice)}</strong></span>
                </div>
                <div class="detail_item">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Tanggal Booking: <strong>${formatDate(booking.bookedAt)}</strong></span>
                </div>
            </div>
            
            <div class="booking_actions">
                <button class="btn btn-primary" onclick="viewBookingDetails('${booking.id}')">
                    <i class="fas fa-eye"></i> Detail
                </button>
                ${canCancel ? `
                    <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">
                        <i class="fas fa-times"></i> Batalkan
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="printBooking('${booking.id}')">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    `;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Menunggu Persetujuan',
        'accepted': 'Diterima',
        'finished': 'Selesai',
        'rejected': 'Ditolak'
    };
    return statusMap[status] || status;
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchBooking');
    searchInput.addEventListener('input', function() {
        searchBookings();
    });
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', function() {
        filterBookings();
    });
}

// Search bookings
function searchBookings() {
    const searchTerm = document.getElementById('searchBooking').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredBookings = allBookings.filter(booking => {
        const matchesUser = booking.customerId === currentUser.id || 
                           booking.customerEmail === currentUser.email;
        
        if (!matchesUser) return false;
        
        const matchesSearch = booking.vehicleName.toLowerCase().includes(searchTerm) ||
                             booking.id.toLowerCase().includes(searchTerm);
        
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    updateStatistics();
    renderBookings();
}

// Filter bookings
function filterBookings() {
    searchBookings(); // This will handle both search and filter
}

// Cancel booking
function cancelBooking(bookingId) {
    if (!confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
        return;
    }

    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex !== -1) {
        // Make the vehicle available again
        updateVehicleStatus(bookings[bookingIndex].vehicleId, 'available');
        
        // Remove the booking
        bookings.splice(bookingIndex, 1);
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));

        // Reload the UI
        loadBookings();
        showAlert('Pemesanan berhasil dibatalkan!', 'success');
    } else {
        showAlert('Gagal membatalkan pemesanan. Data tidak ditemukan.', 'error');
    }
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) {
        showAlert('Pemesanan tidak ditemukan!', 'danger');
        return;
    }
    
    // Create detailed view
    const details = `
        <div style="text-align: left;">
            <h4>Detail Pemesanan</h4>
            <hr>
            <p><strong>ID Pemesanan:</strong> ${booking.id}</p>
            <p><strong>Mobil:</strong> ${booking.vehicleName}</p>
            <p><strong>Tanggal Sewa:</strong> ${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</p>
            <p><strong>Durasi:</strong> ${booking.totalDays} hari</p>
            <p><strong>Harga per Hari:</strong> ${formatCurrency(booking.pricePerDay)}</p>
            <p><strong>Total Pembayaran:</strong> ${formatCurrency(booking.totalPrice)}</p>
            <p><strong>Status:</strong> ${getStatusText(booking.status)}</p>
            <p><strong>Tanggal Booking:</strong> ${formatDate(booking.bookingDate)}</p>
            ${booking.notes ? `<p><strong>Catatan:</strong> ${booking.notes}</p>` : ''}
        </div>
    `;
    
    alert(details);
}

// Print booking
function printBooking(bookingId) {
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) {
        showAlert('Pemesanan tidak ditemukan!', 'danger');
        return;
    }
    
    // Create print content
    const printContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center; color: #fe5b29;">TRATOR - Bukti Pemesanan</h2>
            <hr>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; font-weight: bold;">ID Pemesanan:</td>
                    <td style="padding: 10px;">${booking.id}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Mobil:</td>
                    <td style="padding: 10px;">${booking.vehicleName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Tanggal Sewa:</td>
                    <td style="padding: 10px;">${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Durasi:</td>
                    <td style="padding: 10px;">${booking.totalDays} hari</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Total Pembayaran:</td>
                    <td style="padding: 10px;">${formatCurrency(booking.totalPrice)}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Status:</td>
                    <td style="padding: 10px;">${getStatusText(booking.status)}</td>
                </tr>
            </table>
            <hr>
            <p style="text-align: center; font-size: 12px; color: #666;">
                Cetak pada: ${new Date().toLocaleString('id-ID')}
            </p>
        </div>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Update vehicle status
function updateVehicleStatus(vehicleId, status) {
    const VEHICLE_STORAGE_KEY = 'trator_vehicles';
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

// Get vehicles from localStorage
function getVehicles() {
    const VEHICLE_STORAGE_KEY = 'trator_vehicles';
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                return parsedData;
            }
        } catch (e) {
            console.error('Error parsing vehicle data:', e);
        }
    }
    return [];
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 5000);
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
} 