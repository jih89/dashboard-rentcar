// Fungsi untuk memuat data dashboard admin
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login dan adalah admin
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Update navbar admin
    updateAdminNavbar();
    
    // Refresh data setiap 30 detik
    setInterval(loadDashboardData, 30000);
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Fungsi untuk mendapatkan data user yang sedang login
function getCurrentUser() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Fungsi untuk load data dashboard
function loadDashboardData() {
    // Simulasi loading data
    setTimeout(() => {
        loadVehicleData(); // Memuat data kendaraan (termasuk status)
        loadUserData(); // Panggil fungsi untuk memuat data pengguna
        loadBookingData(); // Panggil fungsi untuk memuat data booking
        loadRevenueData(); // Panggil fungsi untuk memuat data pendapatan
        loadRecentActivities(); // Call the new function

        // Hide loading spinner if it exists
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Show dashboard content if it exists
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.style.display = 'block';
        }
    }, 500); // Mengurangi timeout untuk loading lebih cepat
}

// --- Data Sinkronisasi ---
const VEHICLE_STORAGE_KEY = 'vehiclesData';

function getVehiclesData() {
    // Ambil dari localStorage saja
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                console.log('Data dari localStorage:', parsedData.length, 'mobil');
                return parsedData;
            }
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
            localStorage.removeItem(VEHICLE_STORAGE_KEY);
        }
    }
    
    console.log('Tidak ada data mobil di localStorage');
    return [];
}

// Fungsi untuk load data mobil
function loadVehicleData() {
    try {
        // Ambil data mobil dari localStorage
        const vehicles = getVehiclesData();
        
        // Cek apakah elemen ada sebelum mengubahnya
        const totalVehiclesElement = document.getElementById('totalVehicles');
        if (totalVehiclesElement) {
            totalVehiclesElement.textContent = vehicles.length;
        }
        
        // Update vehicle status
        updateVehicleStatus(vehicles);

        // Show empty state if no vehicles
        if (vehicles.length === 0) {
            const statsContainer = document.querySelector('.row.mb-4');
            if(statsContainer) {
                statsContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-info" style="padding: 40px; margin: 20px 0;">
                            <i class="fas fa-info-circle" style="font-size: 48px; color: #17a2b8; margin-bottom: 20px;"></i>
                            <h4 style="color: #17a2b8; margin-bottom: 15px;">Belum Ada Data Mobil</h4>
                            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                                Silahkan tambahkan data mobil terlebih dahulu untuk memulai
                            </p>
                            <a href="manage-vehicles.html" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Tambah Mobil Pertama
                            </a>
                        </div>
                    </div>
                `;
            }
        }
        
    } catch (error) {
        console.error('Error loading vehicle data:', error);
        const totalVehiclesElement = document.getElementById('totalVehicles');
        if (totalVehiclesElement) {
            totalVehiclesElement.textContent = '0';
        }
    }
}

// Fungsi untuk load data user
function loadUserData() {
    try {
        const allUsers = getAllUsers();
        document.getElementById('totalUsers').textContent = allUsers.length;
        
    } catch (error) {
        console.error('Error loading user data:', error);
        document.getElementById('totalUsers').textContent = '0';
    }
}

// Fungsi untuk load data booking (simulasi)
function loadBookingData() {
    const bookings = getBookings();
    document.getElementById('totalBookings').textContent = bookings.length;
}

// Fungsi untuk load data revenue (simulasi)
function loadRevenueData() {
    const bookings = getBookings();
    const finishedBookings = bookings.filter(booking => booking.status === 'finished');
    const totalRevenue = finishedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
}

function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    if (!activitiesContainer) return;

    const users = (JSON.parse(localStorage.getItem('registeredUsers')) || []).map(u => ({...u, type: 'user', date: new Date(u.createdAt)}));
    const bookings = getBookings().map(b => ({...b, type: 'booking', date: new Date(b.bookingDate)}));

    const activities = [...users, ...bookings]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<div class="text-center text-muted p-4">No recent activities.</div>';
        return;
    }

    activitiesContainer.innerHTML = activities.map(activity => {
        if (activity.type === 'user') {
            return `
                <div class="activity-item" style="padding: 15px 0; border-bottom: 1px solid #eee;">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong style="color: #333;">User baru terdaftar</strong>
                            <p style="color: #666; margin: 5px 0 0 0;">${activity.email}</p>
                        </div>
                        <small style="color: #999;">${new Date(activity.date).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
        } else { // booking
            return `
                <div class="activity-item" style="padding: 15px 0; border-bottom: 1px solid #eee;">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong style="color: #333;">Booking baru</strong>
                            <p style="color: #666; margin: 5px 0 0 0;">${activity.vehicleName} - ${formatCurrency(activity.totalPrice)}</p>
                        </div>
                        <small style="color: #999;">${new Date(activity.date).toLocaleDateString()}</small>
                    </div>
                </div>
            `;
        }
    }).join('');
}

// Fungsi untuk update vehicle status
function updateVehicleStatus(vehicles) {
    const vehicleStatusContainer = document.getElementById('vehicleStatus');
    
    if (!vehicleStatusContainer) return;
    
    // Hitung status mobil dari data asli
    const availableCount = vehicles.filter(v => v.status === 'available').length;
    const rentedCount = vehicles.filter(v => v.status === 'rented').length;
    const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;
    
    vehicleStatusContainer.innerHTML = `
        <div class="status-item" style="padding: 10px 0;">
            <div class="d-flex justify-content-between align-items-center">
                <span style="color: #333;">Available</span>
                <span class="badge badge-success" style="background-color: #28a745; padding: 8px 12px; border-radius: 20px;">${availableCount}</span>
            </div>
        </div>
        <div class="status-item" style="padding: 10px 0;">
            <div class="d-flex justify-content-between align-items-center">
                <span style="color: #333;">Rented</span>
                <span class="badge badge-warning" style="background-color: #ffc107; padding: 8px 12px; border-radius: 20px;">${rentedCount}</span>
            </div>
        </div>
        <div class="status-item" style="padding: 10px 0;">
            <div class="d-flex justify-content-between align-items-center">
                <span style="color: #333;">Maintenance</span>
                <span class="badge badge-danger" style="background-color: #dc3545; padding: 8px 12px; border-radius: 20px;">${maintenanceCount}</span>
            </div>
        </div>
    `;
}

// Fungsi untuk update navbar admin
function updateAdminNavbar() {
    const currentUser = getCurrentUser();
    const adminDropdown = document.querySelector('.dropdown-toggle');
    
    if (currentUser && adminDropdown) {
        adminDropdown.textContent = currentUser.name || 'Admin';
    }
}

// Fungsi untuk format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Quick Action Functions

// Fungsi untuk tambah mobil
function addVehicle() {
    alert('Fitur tambah mobil akan segera tersedia!');
    // TODO: Implement modal atau halaman untuk tambah mobil
}

// Fungsi untuk kelola users
function manageUsers() {
    window.location.href = 'manage-users.html';
}

// Fungsi untuk lihat bookings
function viewBookings() {
    alert('Fitur Lihat Bookings akan segera hadir!');
    // TODO: Implement booking management
}

// Fungsi untuk generate report
function generateReport() {
    alert('Fitur Generate Report akan segera hadir!');
    // TODO: Implement report generation
}

// Fungsi untuk menampilkan alert
function showAlert(message, type = 'info') {
    // Hapus alert yang sudah ada
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Buat alert baru
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Fungsi untuk mendapatkan semua user
function getAllUsers() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const defaultUsers = [
        {
            id: 'default-customer',
            email: 'customer@trator.com',
            name: 'John Doe',
            role: 'customer',
            createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'default-admin',
            email: 'admin@trator.com',
            name: 'Admin Trator',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00.000Z'
        }
    ];
    
    return [...defaultUsers, ...registeredUsers];
}

// Fungsi untuk mendapatkan semua mobil
function getAllVehicles() {
    try {
        return window.vehicles || [];
    } catch (error) {
        console.error('Error getting vehicles:', error);
        return [];
    }
}

// Fungsi untuk export data (untuk fitur report)
function exportData(data, filename, type = 'json') {
    let content, mimeType;
    
    if (type === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
    } else if (type === 'csv') {
        content = convertToCSV(data);
        mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Fungsi untuk convert data ke CSV
function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');
    
    return csvContent;
}

const BOOKING_STORAGE_KEY = 'trator_bookings';
function getBookings() {
    return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY)) || [];
}

// Event listeners untuk real-time updates
// REMOVED: Duplicate DOMContentLoaded event listener 