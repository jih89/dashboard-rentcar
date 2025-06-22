// Array untuk menyimpan data user yang sudah terdaftar
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Fungsi untuk mengecek status login dan redirect otomatis
function checkLoginStatus() {
    const user = getCurrentUser();
    
    if (user) {
        console.log('User sudah login, redirecting to dashboard...');
        showAlert('Anda sudah login! Mengalihkan ke dashboard...', 'success');
        
        // Redirect berdasarkan role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1500);
    }
}

// Fungsi untuk mendapatkan data user yang sedang login
function getCurrentUser() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Fungsi untuk menangani form registrasi
document.addEventListener('DOMContentLoaded', function() {
    // Cek status login terlebih dahulu
    checkLoginStatus();
    
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil data form
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                role: document.getElementById('selectedRole').value,
                agreeTerms: document.getElementById('agreeTerms').checked
            };
            
            // Validasi form
            const validationResult = validateRegistrationForm(formData);
            
            if (validationResult.isValid) {
                // Proses registrasi
                const registrationResult = processRegistration(formData);
                
                if (registrationResult.success) {
                    showAlert('Registrasi berhasil! Mengalihkan ke halaman login...', 'success');
                    
                    // Redirect ke halaman login setelah 2 detik
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showAlert(registrationResult.message, 'error');
                }
            } else {
                showAlert(validationResult.message, 'error');
            }
        });
    }
    
    // Setup role selection
    setupRoleSelection();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup input effects
    setupInputEffects();
});

// Fungsi untuk setup pemilihan role
function setupRoleSelection() {
    const customerRole = document.getElementById('customerRole');
    const adminRole = document.getElementById('adminRole');
    const selectedRoleInput = document.getElementById('selectedRole');
    
    if (customerRole && adminRole) {
        // Set default selection
        selectRole('customer');
        
        customerRole.addEventListener('click', function() {
            selectRole('customer');
        });
        
        adminRole.addEventListener('click', function() {
            selectRole('admin');
        });
    }
}

// Fungsi untuk memilih role
function selectRole(role) {
    const customerRole = document.getElementById('customerRole');
    const adminRole = document.getElementById('adminRole');
    const selectedRoleInput = document.getElementById('selectedRole');
    
    if (role === 'customer') {
        customerRole.style.borderColor = '#fe5b29';
        customerRole.style.backgroundColor = '#fff5f2';
        customerRole.querySelector('i').style.color = '#fe5b29';
        
        adminRole.style.borderColor = '#e9ecef';
        adminRole.style.backgroundColor = 'white';
        adminRole.querySelector('i').style.color = '#666';
        
        selectedRoleInput.value = 'customer';
    } else {
        adminRole.style.borderColor = '#fe5b29';
        adminRole.style.backgroundColor = '#fff5f2';
        adminRole.querySelector('i').style.color = '#fe5b29';
        
        customerRole.style.borderColor = '#e9ecef';
        customerRole.style.backgroundColor = 'white';
        customerRole.querySelector('i').style.color = '#666';
        
        selectedRoleInput.value = 'admin';
    }
}

// Fungsi untuk setup validasi form
function setupFormValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Real-time password validation
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePasswordStrength(this.value);
        });
    }
    
    // Real-time confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }
    
    // Real-time email validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    // Real-time phone validation
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
}

// Fungsi untuk setup efek input
function setupInputEffects() {
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
}

// Fungsi untuk validasi form registrasi
function validateRegistrationForm(formData) {
    // Validasi nama lengkap
    if (!formData.fullName || formData.fullName.length < 3) {
        return {
            isValid: false,
            message: 'Nama lengkap minimal 3 karakter'
        };
    }
    
    // Validasi email
    if (!isValidEmail(formData.email)) {
        return {
            isValid: false,
            message: 'Format email tidak valid'
        };
    }
    
    // Validasi nomor telepon
    if (!isValidPhone(formData.phone)) {
        return {
            isValid: false,
            message: 'Format nomor telepon tidak valid'
        };
    }
    
    // Validasi alamat
    if (!formData.address || formData.address.length < 10) {
        return {
            isValid: false,
            message: 'Alamat minimal 10 karakter'
        };
    }
    
    // Validasi password
    if (!isValidPassword(formData.password)) {
        return {
            isValid: false,
            message: 'Password minimal 6 karakter dengan kombinasi huruf dan angka'
        };
    }
    
    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
        return {
            isValid: false,
            message: 'Konfirmasi password tidak cocok'
        };
    }
    
    // Validasi terms and conditions
    if (!formData.agreeTerms) {
        return {
            isValid: false,
            message: 'Anda harus menyetujui syarat dan ketentuan'
        };
    }
    
    return {
        isValid: true,
        message: 'Validasi berhasil'
    };
}

// Fungsi untuk validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Fungsi untuk validasi nomor telepon
function isValidPhone(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Fungsi untuk validasi password
function isValidPassword(password) {
    // Minimal 6 karakter dengan kombinasi huruf dan angka
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
}

// Fungsi untuk validasi kekuatan password
function validatePasswordStrength(password) {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    let strength = 0;
    let message = '';
    
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
            message = 'Sangat Lemah';
            passwordInput.style.borderColor = '#dc3545';
            break;
        case 2:
            message = 'Lemah';
            passwordInput.style.borderColor = '#fd7e14';
            break;
        case 3:
            message = 'Sedang';
            passwordInput.style.borderColor = '#ffc107';
            break;
        case 4:
            message = 'Kuat';
            passwordInput.style.borderColor = '#28a745';
            break;
        case 5:
            message = 'Sangat Kuat';
            passwordInput.style.borderColor = '#28a745';
            break;
    }
}

// Fungsi untuk validasi konfirmasi password
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = '#dc3545';
    } else if (confirmPassword) {
        confirmPasswordInput.style.borderColor = '#28a745';
    }
}

// Fungsi untuk format nomor telepon
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('0')) {
        value = value.substring(1);
    }
    
    if (value.startsWith('62')) {
        value = value.substring(2);
    }
    
    if (value.startsWith('8')) {
        value = '62' + value;
    }
    
    // Format: +62 8xx xxxx xxxx
    if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{1})(\d{3})(\d{3})(\d{3})/, '+$1 $2$3 $4 $5');
    }
    
    input.value = value;
}

// Fungsi untuk validasi email
function validateEmail(email) {
    const emailInput = document.getElementById('email');
    
    if (email && !isValidEmail(email)) {
        emailInput.style.borderColor = '#dc3545';
    } else if (email) {
        emailInput.style.borderColor = '#28a745';
    }
}

// Fungsi untuk memproses registrasi
function processRegistration(formData) {
    // Cek apakah email sudah terdaftar
    const existingUser = registeredUsers.find(user => user.email.toLowerCase() === formData.email.toLowerCase());
    
    if (existingUser) {
        return {
            success: false,
            message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
        };
    }
    
    // Buat user baru
    const newUser = {
        id: Date.now(),
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password, // Dalam implementasi nyata, password harus di-hash
        role: formData.role,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Tambahkan ke array user
    registeredUsers.push(newUser);
    
    // Simpan ke localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    return {
        success: true,
        message: 'Registrasi berhasil!'
    };
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

// Fungsi untuk mendapatkan semua user yang terdaftar
function getAllRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers')) || [];
}

// Fungsi untuk mencari user berdasarkan email
function findUserByEmail(email) {
    const users = getAllRegisteredUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Fungsi untuk update user
function updateUser(userId, updatedData) {
    const users = getAllRegisteredUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        return true;
    }
    
    return false;
}

// Fungsi untuk delete user
function deleteUser(userId) {
    const users = getAllRegisteredUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('registeredUsers', JSON.stringify(filteredUsers));
} 