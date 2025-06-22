// Fungsi untuk mendapatkan data user yang sedang login
function getCurrentUser() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Fungsi untuk update navbar berdasarkan status login
function updateNavbar() {
    const user = getCurrentUser();
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (user && loginLink) {
        const parentLi = loginLink.parentElement;
        parentLi.innerHTML = `
            <div class="dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${user.name}
                </a>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="${user.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html'}">Dashboard</a>
                    <a class="dropdown-item" href="profile.html">Profil</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
                </div>
            </div>
        `;
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Fungsi untuk memuat data dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah user sudah login
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update informasi user
    updateUserInfo(user);
    
    // Update navbar
    updateNavbar();
    
    // Load dashboard data
    loadDashboardData();
    
    // Tambahkan efek hover pada card
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
    
    // Tambahkan efek hover pada tombol aksi cepat
    const actionButtons = document.querySelectorAll('.btn-outline-primary');
    actionButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#fe5b29';
            this.style.color = 'white';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#fe5b29';
        });
    });
});

// Fungsi untuk update informasi user di dashboard
function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userFullName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone;
}

// Fungsi untuk memuat data dashboard
function loadDashboardData() {
    // Simulasi data dashboard (dalam implementasi nyata, ini akan diambil dari API)
    const dashboardData = {
        totalRentals: 5,
        activeRentals: 1,
        totalSpent: 2500000,
        recentRentals: [
            {
                id: 1,
                vehicleName: 'Toyota Avanza',
                startDate: '2024-01-15',
                endDate: '2024-01-17',
                totalPrice: 700000,
                status: 'Selesai'
            },
            {
                id: 2,
                vehicleName: 'Honda Brio',
                startDate: '2024-01-20',
                endDate: '2024-01-22',
                totalPrice: 500000,
                status: 'Aktif'
            }
        ]
    };
    
    // Update statistik
    document.getElementById('totalRentals').textContent = dashboardData.totalRentals;
    document.getElementById('activeRentals').textContent = dashboardData.activeRentals;
    document.getElementById('totalSpent').textContent = formatCurrency(dashboardData.totalSpent);
    
    // Update riwayat sewa terbaru
    updateRecentRentals(dashboardData.recentRentals);
}

// Fungsi untuk update riwayat sewa terbaru
function updateRecentRentals(rentals) {
    const container = document.getElementById('recentRentals');
    
    if (rentals.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 40px; color: #666;">
                <i class="fa fa-car" style="font-size: 50px; color: #ddd; margin-bottom: 15px;"></i>
                <p>Belum ada riwayat sewa</p>
                <a href="vehicles.html" class="btn" style="background-color: #fe5b29; color: white; border-radius: 8px; padding: 10px 20px; text-decoration: none;">Sewa Mobil Sekarang</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="table-responsive"><table class="table table-hover">';
    html += `
        <thead>
            <tr>
                <th>Mobil</th>
                <th>Tanggal Sewa</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    rentals.forEach(rental => {
        const statusClass = rental.status === 'Aktif' ? 'badge badge-success' : 'badge badge-secondary';
        html += `
            <tr>
                <td>${rental.vehicleName}</td>
                <td>${formatDate(rental.startDate)} - ${formatDate(rental.endDate)}</td>
                <td>${formatCurrency(rental.totalPrice)}</td>
                <td><span class="${statusClass}">${rental.status}</span></td>
                <td>
                    <a href="rental-detail.html?id=${rental.id}" class="btn btn-sm" style="background-color: #fe5b29; color: white; border-radius: 5px; padding: 5px 10px; text-decoration: none; font-size: 12px;">Detail</a>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Fungsi untuk format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Fungsi untuk format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Fungsi untuk refresh dashboard
function refreshDashboard() {
    loadDashboardData();
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto hide setelah 5 detik
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
} 