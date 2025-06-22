// --- Data Handling ---
const VEHICLE_STORAGE_KEY = 'vehiclesData';

function getVehicles() {
    // Ambil dari localStorage saja
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                return parsedData;
            }
        } catch (e) {
            console.error('Error parsing localStorage data:', e);
            localStorage.removeItem(VEHICLE_STORAGE_KEY);
        }
    }
    
    return [];
}

function saveVehicles(vehicles) {
    localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(vehicles));
}

// --- Sinkronisasi Data ---
function syncDataWithDataJS() {
    // Jika localStorage kosong, copy data dari data.js
    const vehicles = getVehicles();
    if (vehicles.length === 0 && window.vehicles && window.vehicles.length > 0) {
        saveVehicles(window.vehicles);
    }
}

function resetToDefaultData() {
    if (window.vehicles && window.vehicles.length > 0) {
        saveVehicles(window.vehicles);
        renderVehiclesTable();
        showAlert('Data berhasil direset ke default!', 'success');
    } else {
        showAlert('Tidak ada data default tersedia!', 'warning');
    }
}

function exportDataToJSON() {
    const vehicles = getVehicles();
    if (vehicles.length === 0) {
        showAlert('Tidak ada data untuk diexport!', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(vehicles, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vehicles-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showAlert('Data berhasil diexport!', 'success');
}

function importDataFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (Array.isArray(data) && data.length > 0) {
                    saveVehicles(data);
                    renderVehiclesTable();
                    showAlert('Data berhasil diimport!', 'success');
                } else {
                    showAlert('Format file tidak valid!', 'danger');
                }
            } catch (error) {
                showAlert('Error membaca file!', 'danger');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// --- Render Table ---
function renderVehiclesTable() {
    const vehicles = getVehicles();
    const searchTerm = document.getElementById('searchVehicle').value.toLowerCase();
    const brandFilter = document.getElementById('filterBrand').value;
    const typeFilter = document.getElementById('filterType').value;
    const tbody = document.getElementById('vehiclesTableBody');
    const noDataMsg = document.getElementById('noDataMessage');

    // Filter vehicles
    let filtered = vehicles.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm) || 
                             v.brand.toLowerCase().includes(searchTerm);
        const matchesBrand = !brandFilter || v.brand === brandFilter;
        const matchesType = !typeFilter || v.type === typeFilter;
        return matchesSearch && matchesBrand && matchesType;
    });

    tbody.innerHTML = '';
    
    if (!vehicles || vehicles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="alert alert-info" style="padding: 40px; margin: 20px 0;">
                        <i class="fas fa-info-circle" style="font-size: 48px; color: #17a2b8; margin-bottom: 20px;"></i>
                        <h4 style="color: #17a2b8; margin-bottom: 15px;">Belum Ada Data Mobil</h4>
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                            Silahkan tambahkan data mobil terlebih dahulu untuk memulai
                        </p>
                        <button class="btn btn-primary" onclick="showAddVehicleModal()">
                            <i class="fas fa-plus"></i> Tambah Mobil Pertama
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    if (filtered.length === 0) {
        if (noDataMsg) noDataMsg.style.display = 'block';
        return;
    } else {
        if (noDataMsg) noDataMsg.style.display = 'none';
    }

    filtered.forEach((v, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td><img src="${v.image}" alt="${v.name}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 6px;"></td>
            <td>${v.name}</td>
            <td>${v.brand}</td>
            <td>${v.type.toUpperCase()}</td>
            <td>${v.year}</td>
            <td>Rp ${Number(v.price).toLocaleString('id-ID')}</td>
            <td>${statusBadge(v.status)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editVehicle('${v.id}')" title="Edit"><i class="fa fa-pencil"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteVehiclePrompt('${v.id}')" title="Hapus"><i class="fa fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function statusBadge(status) {
    if (status === 'available') return '<span class="badge badge-success">Tersedia</span>';
    if (status === 'rented') return '<span class="badge badge-warning">Disewa</span>';
    if (status === 'maintenance') return '<span class="badge badge-danger">Maintenance</span>';
    return '';
}

// --- Filter & Search ---
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu sebentar untuk memastikan semua elemen sudah dimuat
    setTimeout(() => {
        // Sinkronisasi data saat halaman dimuat
        syncDataWithDataJS();
        
        // Render table
        renderVehiclesTable();
        
        // Event listeners
        const searchInput = document.getElementById('searchVehicle');
        const brandFilter = document.getElementById('filterBrand');
        const typeFilter = document.getElementById('filterType');
        
        if (searchInput) {
            searchInput.addEventListener('input', renderVehiclesTable);
        }
        if (brandFilter) {
            brandFilter.addEventListener('change', renderVehiclesTable);
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', renderVehiclesTable);
        }
        
        // Update halaman vehicles.html jika ada perubahan
        updateVehiclesPage();
    }, 100);
});

function resetFilters() {
    document.getElementById('searchVehicle').value = '';
    document.getElementById('filterBrand').value = '';
    document.getElementById('filterType').value = '';
    renderVehiclesTable();
}

// --- Update Vehicles Page ---
function updateVehiclesPage() {
    // Jika ada perubahan data, update halaman vehicles.html
    const vehicles = getVehicles();
    if (window.vehicles && vehicles.length !== window.vehicles.length) {
        // Data mobil berubah, perlu update halaman vehicles.html
    }
}

// --- Add/Edit Vehicle Modal ---
function showAddVehicleModal() {
    clearVehicleForm();
    document.getElementById('vehicleModalLabel').textContent = 'Tambah Mobil Baru';
    $('#vehicleModal').modal('show');
}

function editVehicle(id) {
    const vehicles = getVehicles();
    const v = vehicles.find(x => x.id == id);
    if (!v) return;
    document.getElementById('vehicleModalLabel').textContent = 'Edit Mobil';
    document.getElementById('vehicleId').value = v.id;
    document.getElementById('vehicleName').value = v.name;
    document.getElementById('vehicleBrand').value = v.brand;
    document.getElementById('vehicleType').value = v.type;
    document.getElementById('vehicleYear').value = v.year;
    document.getElementById('vehiclePrice').value = v.price;
    document.getElementById('vehicleStatus').value = v.status;
    document.getElementById('vehicleImage').value = v.image;
    document.getElementById('vehicleDescription').value = v.description || '';
    $('#vehicleModal').modal('show');
}

function clearVehicleForm() {
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleId').value = '';
}

function saveVehicle() {
    const id = document.getElementById('vehicleId').value;
    const name = document.getElementById('vehicleName').value.trim();
    const brand = document.getElementById('vehicleBrand').value;
    const type = document.getElementById('vehicleType').value;
    const year = document.getElementById('vehicleYear').value;
    const price = document.getElementById('vehiclePrice').value;
    const status = document.getElementById('vehicleStatus').value;
    const image = document.getElementById('vehicleImage').value.trim();
    const description = document.getElementById('vehicleDescription').value.trim();

    if (!name || !brand || !type || !year || !price || !status || !image) {
        showAlert('Semua field wajib diisi!', 'danger');
        return;
    }

    let vehicles = getVehicles();
    if (id) {
        // Edit - pastikan data konsisten
        vehicles = vehicles.map(v => v.id == id ? { 
            ...v, 
            name, 
            brand, 
            type, 
            year, 
            price, 
            status, 
            image, 
            description,
            // Pastikan field available juga sinkron dengan status
            available: status === 'available'
        } : v);
        showAlert('Data mobil berhasil diupdate!', 'success');
    } else {
        // Add - pastikan data konsisten
        const newId = 'v' + Date.now();
        vehicles.push({ 
            id: newId, 
            name, 
            brand, 
            type, 
            year, 
            price, 
            status, 
            image, 
            description,
            // Pastikan field available juga sinkron dengan status
            available: status === 'available',
            // Tambahkan field default yang diperlukan
            transmission: 'Automatic',
            fuel: 'Petrol',
            seats: 5,
            features: []
        });
        showAlert('Mobil baru berhasil ditambahkan!', 'success');
    }
    saveVehicles(vehicles);
    $('#vehicleModal').modal('hide');
    renderVehiclesTable();
    
    // Update halaman vehicles.html
    updateVehiclesPage();
}

// --- Delete Vehicle ---
let deleteVehicleId = null;
function deleteVehiclePrompt(id) {
    const vehicles = getVehicles();
    const v = vehicles.find(x => x.id == id);
    if (!v) return;
    deleteVehicleId = id;
    document.getElementById('deleteVehicleName').textContent = v.name;
    $('#deleteModal').modal('show');
}

function confirmDelete() {
    if (!deleteVehicleId) return;
    let vehicles = getVehicles();
    vehicles = vehicles.filter(v => v.id != deleteVehicleId);
    saveVehicles(vehicles);
    $('#deleteModal').modal('hide');
    renderVehiclesTable();
    showAlert('Data mobil berhasil dihapus!', 'success');
    deleteVehicleId = null;
    
    // Update halaman vehicles.html
    updateVehiclesPage();
}

// --- Alert ---
function showAlert(message, type = 'info') {
    // Hapus alert yang sudah ada
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => { if (alertDiv.parentNode) alertDiv.remove(); }, 4000);
}

// --- Auth Check ---
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user || (JSON.parse(user).role !== 'admin')) {
        alert('Akses hanya untuk admin!');
        window.location.href = 'login.html';
    }
});

// --- Logout ---
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
} 