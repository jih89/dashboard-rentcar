// Data user untuk simulasi login (default users)
const defaultUsers = [
    {
        email: 'customer@trator.com',
        password: 'customer123',
        name: 'John Doe',
        role: 'customer',
        phone: '081234567890'
    },
    {
        email: 'admin@trator.com',
        password: 'admin123',
        name: 'Admin Trator',
        role: 'admin',
        phone: '081234567891'
    }
];

// Flag untuk mencegah infinite loop
let isRedirecting = false;
let isInitialized = false;

// Fungsi untuk mendapatkan semua user (default + registered)
function getAllUsers() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    return [...defaultUsers, ...registeredUsers];
}

// Fungsi untuk menangani form login
document.addEventListener('DOMContentLoaded', function() {
    // Mencegah multiple initialization
    if (isInitialized) {
        console.log('Login page already initialized, skipping...');
        return;
    }
    isInitialized = true;
    
    console.log('Initializing login page...');
    
    // Cek status login terlebih dahulu
    checkLoginStatus();
    
    // Update navbar hanya jika user sudah login
    const user = getCurrentUser();
    if (user) {
        updateNavbar();
    }
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Validasi form
            if (!email || !password) {
                showAlert('Mohon isi email dan password', 'error');
                return;
            }
            
            // Validasi format email
            if (!isValidEmail(email)) {
                showAlert('Format email tidak valid', 'error');
                return;
            }
            
            // Proses login
            const user = authenticateUser(email, password);
            
            if (user) {
                // Simpan data user ke localStorage
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(user));
                }
                
                showAlert('Login berhasil! Mengalihkan ke dashboard...', 'success');
                
                // Redirect berdasarkan role
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 2000);
                
            } else {
                showAlert('Email atau password salah', 'error');
            }
        });
    }
    
    // Tambahkan efek hover pada input fields
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#fe5b29';
            this.style.boxShadow = '0 0 0 0.2rem rgba(254, 91, 41, 0.25)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e9ecef';
            this.style.boxShadow = 'none';
        });
    });
    
    console.log('Login page initialization complete');
});

// Fungsi untuk validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fungsi untuk autentikasi user
function authenticateUser(email, password) {
    const allUsers = getAllUsers();
    return allUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
    );
}

// Fungsi untuk menampilkan alert
function showAlert(message, type) {
    // Hapus alert yang sudah ada
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Buat alert baru
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
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

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Fungsi untuk cek status login
function isLoggedIn() {
    return localStorage.getItem('user') || sessionStorage.getItem('user');
}

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

// Fungsi untuk mengecek status login dan redirect otomatis
function checkLoginStatus() {
    // Mencegah infinite loop
    if (isRedirecting) {
        console.log('Already redirecting, skipping checkLoginStatus...');
        return;
    }
    
    const user = getCurrentUser();
    console.log('checkLoginStatus called, user:', user);
    
    if (user) {
        console.log('User sudah login, redirecting to dashboard...', user);
        isRedirecting = true;
        showAlert('Anda sudah login! Mengalihkan ke dashboard...', 'success');
        
        // Redirect berdasarkan role
        setTimeout(() => {
            const targetPage = user.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
            console.log('Executing redirect to:', targetPage);
            window.location.href = targetPage;
        }, 1500);
    } else {
        console.log('No user logged in, staying on login page');
    }
} 