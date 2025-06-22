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

// Test paling sederhana
console.log('vehicle-detail.js dimuat');

// Fungsi untuk memuat detail mobil
function loadVehicleDetail() {
    console.log('Loading vehicle detail...');
    console.log('window.vehicles available:', !!window.vehicles);
    console.log('window.vehicles length:', window.vehicles ? window.vehicles.length : 'undefined');
    
    // Update data dari localStorage jika ada perubahan
    let vehiclesData = getVehiclesData();
    
    const container = document.getElementById('vehicleDetailContainer');
    console.log('Container:', container);
    
    if (container) {
        // Cek data tersedia
        if (typeof vehiclesData === 'undefined' || vehiclesData.length === 0) {
            container.innerHTML = '<div class="text-center"><h2 style="color: #fe5b29;">ERROR: Data mobil tidak tersedia</h2></div>';
            return;
        }
        
        console.log('Data mobil tersedia:', vehiclesData.length, 'mobil');
        
        // Ambil ID dari URL
        const params = new URLSearchParams(window.location.search);
        const vehicleId = params.get('id');
        console.log('ID mobil dari URL:', vehicleId);
        
        if (!vehicleId) {
            container.innerHTML = '<div class="text-center"><h2 style="color: #fe5b29;">Tidak ada ID mobil di URL</h2><p>Silakan pilih mobil dari halaman daftar mobil.</p></div>';
            return;
        }
        
        // Cari mobil (support untuk ID string dan number)
        const vehicle = vehiclesData.find(v => v.id == vehicleId);
        console.log('Mobil ditemukan:', vehicle);
        
        if (!vehicle) {
            container.innerHTML = `
                <div class="text-center" style="padding: 40px;">
                    <div class="alert alert-info" style="padding: 40px; margin: 20px 0;">
                        <i class="fas fa-info-circle" style="font-size: 48px; color: #17a2b8; margin-bottom: 20px;"></i>
                        <h4 style="color: #17a2b8; margin-bottom: 15px;">Mobil Tidak Ditemukan</h4>
                        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                            Mobil yang Anda cari tidak ditemukan atau belum ada data mobil yang tersedia.
                        </p>
                        <p style="font-size: 14px; color: #888; margin-bottom: 20px;">
                            Silahkan tambahkan data dari admin panel terlebih dahulu
                        </p>
                        <div>
                            <a href="vehicles.html" class="btn btn-secondary me-2">
                                <i class="fas fa-arrow-left"></i> Kembali ke Daftar Mobil
                            </a>
                            <a href="admin-dashboard.html" class="btn btn-primary">
                                <i class="fas fa-cog"></i> Ke Admin Panel
                            </a>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Konversi status dari admin panel ke boolean available
        const isAvailable = vehicle.status === 'available' || vehicle.available === true;
        
        container.innerHTML = `
            <div class="row">
                <div class="col-lg-6">
                    <div class="vehicle-image-container">
                        <img src="${vehicle.image}" alt="${vehicle.name}" class="img-fluid rounded shadow">
                        <div class="availability-badge" style="position: absolute; top: 20px; left: 20px; background: ${isAvailable ? '#28a745' : '#dc3545'}; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: bold;">
                            ${isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="vehicle-info">
                        <h2 class="vehicle-title">${vehicle.name}</h2>
                        <p class="vehicle-subtitle">${vehicle.brand} • ${vehicle.type}</p>
                        
                        <div class="vehicle-price">
                            <span class="price-amount">Rp ${vehicle.price.toLocaleString()}</span>
                            <span class="price-period">/day</span>
                        </div>
                        
                        <div class="vehicle-specs">
                            <div class="spec-item">
                                <i class="fas fa-calendar"></i>
                                <span>Tahun: ${vehicle.year}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-cog"></i>
                                <span>Transmisi: ${vehicle.transmission || 'Automatic'}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-gas-pump"></i>
                                <span>Bahan Bakar: ${vehicle.fuel || 'Petrol'}</span>
                            </div>
                            <div class="spec-item">
                                <i class="fas fa-users"></i>
                                <span>Kapasitas: ${vehicle.seats || 5} Kursi</span>
                            </div>
                        </div>
                        
                        <div class="vehicle-features">
                            <h5>Fitur:</h5>
                            <div class="features-grid">
                                ${(vehicle.features || []).map(feature => `
                                    <span class="feature-badge">
                                        <i class="fas fa-check"></i> ${feature}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="vehicle-description">
                            <h5>Deskripsi:</h5>
                            <p>${vehicle.description || 'Tidak ada deskripsi tersedia.'}</p>
                        </div>
                        
                        <div class="vehicle-actions">
                            ${isAvailable ? `
                                <a href="booking.html?id=${vehicle.id}" class="btn btn-primary btn-lg me-3">
                                    <i class="fas fa-calendar-plus"></i> Book Now
                                </a>
                            ` : `
                                <button class="btn btn-secondary btn-lg me-3" disabled>
                                    <i class="fas fa-times"></i> Tidak Tersedia
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Detail mobil berhasil ditampilkan');
        
    } else {
        console.error('Container tidak ditemukan!');
        document.body.innerHTML = '<h1 style="color: red;">ERROR: Container tidak ditemukan!</h1>';
    }
}

// Tunggu halaman selesai dimuat dengan timeout
setTimeout(loadVehicleDetail, 100); // Tunggu 100ms

// Backup dengan DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    setTimeout(loadVehicleDetail, 50);
});

// Backup dengan window load
window.addEventListener('load', function() {
    console.log('Window loaded');
    setTimeout(loadVehicleDetail, 50);
}); 