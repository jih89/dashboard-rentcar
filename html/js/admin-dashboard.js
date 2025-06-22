// Fungsi untuk menangani admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login dan memiliki role admin
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Anda tidak memiliki akses ke halaman ini. Silakan login sebagai admin.');
        window.location.href = 'login.html';
        return;
    }
    
    // Load dashboard data
    loadDashboardData();
    
    // Update navbar
    updateAdminNavbar();
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
        const vehicles = getVehiclesData();
        
        // Update statistics
        document.getElementById('totalVehicles').textContent = vehicles.length;
        // Hitung available berdasarkan status
        const availableCount = vehicles.filter(v => v.status === 'available' || v.available === true).length;
        document.getElementById('availableVehicles').textContent = availableCount;
        document.getElementById('totalRentals').textContent = '25'; // Simulasi
        document.getElementById('totalRevenue').textContent = 'Rp 15.000.000'; // Simulasi
        
        // Show empty state if no vehicles
        if (vehicles.length === 0) {
            const statsContainer = document.querySelector('.row.mb-4');
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
        
        // Hide loading
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
    }, 1000);
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
        document.getElementById('totalVehicles').textContent = vehicles.length;
        
        // Update vehicle status
        updateVehicleStatus(vehicles);
        
    } catch (error) {
        console.error('Error loading vehicle data:', error);
        document.getElementById('totalVehicles').textContent = '0';
    }
}

// Fungsi untuk load data user
function loadUserData() {
    try {
        // Ambil data user dari localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const defaultUsers = [
            { email: 'customer@trator.com', role: 'customer' },
            { email: 'admin@trator.com', role: 'admin' }
        ];
        
        const totalUsers = registeredUsers.length + defaultUsers.length;
        document.getElementById('totalUsers').textContent = totalUsers;
        
    } catch (error) {
        console.error('Error loading user data:', error);
        document.getElementById('totalUsers').textContent = '0';
    }
}

// Fungsi untuk load data booking (simulasi)
function loadBookingData() {
    // Simulasi data booking
    const mockBookings = [
        { id: 1, vehicle: 'Toyota Avanza', customer: 'John Doe', amount: 350000, status: 'active' },
        { id: 2, vehicle: 'Honda Brio', customer: 'Jane Smith', amount: 250000, status: 'completed' },
        { id: 3, vehicle: 'BMW X3', customer: 'Mike Johnson', amount: 800000, status: 'active' }
    ];
    
    document.getElementById('totalBookings').textContent = mockBookings.length;
}

// Fungsi untuk load data revenue (simulasi)
function loadRevenueData() {
    // Simulasi total revenue
    const mockRevenue = 1400000; // Rp 1.400.000
    document.getElementById('totalRevenue').textContent = formatCurrency(mockRevenue);
}

// Fungsi untuk update vehicle status
function updateVehicleStatus(vehicles) {
    const vehicleStatusContainer = document.getElementById('vehicleStatus');
    
    if (!vehicleStatusContainer) return;
    
    // Simulasi status mobil
    const availableCount = Math.floor(vehicles.length * 0.6); // 60% available
    const rentedCount = Math.floor(vehicles.length * 0.3); // 30% rented
    const maintenanceCount = vehicles.length - availableCount - rentedCount; // 10% maintenance
    
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
    alert('Fitur Kelola Users akan segera hadir!');
    // TODO: Implement user management
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

// Event listeners untuk real-time updates
document.addEventListener('DOMContentLoaded', function() {
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