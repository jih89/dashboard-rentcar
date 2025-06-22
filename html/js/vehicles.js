// --- Data Sinkronisasi ---
const VEHICLE_STORAGE_KEY = 'vehiclesData';

function getVehiclesData() {
    console.log('vehicles.js - getVehiclesData called');
    console.log('vehicles.js - VEHICLE_STORAGE_KEY:', VEHICLE_STORAGE_KEY);
    
    // Ambil dari localStorage saja
    const local = localStorage.getItem(VEHICLE_STORAGE_KEY);
    console.log('vehicles.js - localStorage data:', local ? 'exists' : 'empty');
    
    if (local) {
        try {
            const parsedData = JSON.parse(local);
            console.log('vehicles.js - Parsed localStorage data:', parsedData);
            console.log('vehicles.js - is array:', Array.isArray(parsedData));
            console.log('vehicles.js - length:', parsedData ? parsedData.length : 'null');
            
            if (parsedData && Array.isArray(parsedData) && parsedData.length > 0) {
                console.log('vehicles.js - Data dari localStorage:', parsedData.length, 'mobil');
                return parsedData;
            } else {
                console.log('vehicles.js - localStorage data is empty or invalid array');
            }
        } catch (e) {
            console.error('vehicles.js - Error parsing localStorage data:', e);
            localStorage.removeItem(VEHICLE_STORAGE_KEY);
        }
    }
    
    console.log('vehicles.js - Tidak ada data mobil di localStorage');
    return [];
}

// Update variabel global vehiclesData
let vehiclesDataLocal = getVehiclesData();

// Fungsi untuk memformat harga ke format Rupiah
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// Fungsi untuk menampilkan kartu mobil
function createVehicleCard(vehicle) {
    // Konversi status dari admin panel ke boolean available
    const isAvailable = vehicle.status === 'available' || vehicle.available === true;
    const availabilityText = isAvailable ? 'Tersedia' : 'Tidak Tersedia';
    const availabilityClass = isAvailable ? 'available' : 'unavailable';
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="gallery_box" style="height: 100%; display: flex; flex-direction: column; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div class="gallery_img" style="position: relative; height: 200px; overflow: hidden;">
                    <img src="${vehicle.image}" alt="${vehicle.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='images/img-1.png'">
                    <div class="availability-badge ${availabilityClass}" style="position: absolute; top: 10px; left: 10px; background: ${isAvailable ? '#28a745' : '#dc3545'}; color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">${availabilityText}</div>
                </div>
                <div class="gallery_box_text" style="flex: 1; display: flex; flex-direction: column; padding: 20px; background: white;">
                    <h3 class="types_text" style="margin-bottom: 10px; font-size: 18px; font-weight: bold; color: #333;">${vehicle.name}</h3>
                    <p class="looking_text" style="margin-bottom: 15px; color: #666; line-height: 1.4; flex: 1;">${vehicle.description || ''}</p>
                    
                    <div class="vehicle-details" style="margin-bottom: 15px;">
                        <div class="detail-item" style="margin-bottom: 8px; font-size: 14px; color: #555;">
                            <i class="fa fa-calendar" style="margin-right: 8px; color: #fe5b29;"></i> Tahun: ${vehicle.year}
                        </div>
                        <div class="detail-item" style="margin-bottom: 8px; font-size: 14px; color: #555;">
                            <i class="fa fa-cog" style="margin-right: 8px; color: #fe5b29;"></i> Transmisi: ${vehicle.transmission || 'Automatic'}
                        </div>
                        <div class="detail-item" style="margin-bottom: 8px; font-size: 14px; color: #555;">
                            <i class="fa fa-users" style="margin-right: 8px; color: #fe5b29;"></i> Kapasitas: ${vehicle.seats || 5} orang
                        </div>
                        <div class="detail-item" style="margin-bottom: 8px; font-size: 14px; color: #555;">
                            <i class="fa fa-tint" style="margin-right: 8px; color: #fe5b29;"></i> Bahan Bakar: ${vehicle.fuel || 'Petrol'}
                        </div>
                    </div>
                    
                    <div class="price-section" style="margin-bottom: 20px;">
                        <h4 class="price-text" style="font-size: 20px; color: #fe5b29; font-weight: bold; margin: 0;">${formatPrice(vehicle.price)}/hari</h4>
                    </div>
                    
                    <div class="btn_main" style="display: flex; gap: 10px; margin-top: auto;">
                        <div class="read_bt" style="flex: 1;">
                            <a href="vehicle-detail.html?id=${vehicle.id}" style="display: block; text-align: center; padding: 10px; background: #f8f9fa; color: #333; text-decoration: none; border-radius: 4px; transition: all 0.3s; border: 1px solid #e0e0e0;">Lihat Detail</a>
                        </div>
                        ${isAvailable ? `
                        <div class="read_bt active" style="flex: 1;">
                            <a href="booking.html?id=${vehicle.id}" style="display: block; text-align: center; padding: 10px; background: #fe5b29; color: white; text-decoration: none; border-radius: 4px; transition: all 0.3s; border: 1px solid #fe5b29;">Sewa Sekarang</a>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan semua mobil
function displayVehicles(vehicles = vehiclesDataLocal) {
    const container = document.getElementById('vehiclesContainer');
    
    if (!vehicles || vehicles.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info" style="padding: 40px; margin: 20px 0;">
                    <i class="fas fa-info-circle" style="font-size: 48px; color: #17a2b8; margin-bottom: 20px;"></i>
                    <h4 style="color: #17a2b8; margin-bottom: 15px;">Tidak Ada Data Mobil</h4>
                    <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
                        Silahkan tambahkan data dari admin panel terlebih dahulu
                    </p>
                    <a href="admin-dashboard.html" class="btn btn-primary">
                        <i class="fas fa-cog"></i> Ke Admin Panel
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = vehicles.map(vehicle => createVehicleCard(vehicle)).join('');
}

// Fungsi untuk memfilter mobil (dibuat global untuk onclick)
function filterVehicles() {
    const brandFilter = document.getElementById('brandFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    console.log('Filtering with:', { brandFilter, typeFilter, priceFilter });
    
    let filteredVehicles = vehiclesDataLocal.filter(vehicle => {
        // Filter berdasarkan brand
        if (brandFilter && brandFilter !== '' && vehicle.brand !== brandFilter) {
            return false;
        }
        
        // Filter berdasarkan tipe
        if (typeFilter && typeFilter !== '' && vehicle.type !== typeFilter) {
            return false;
        }
        
        // Filter berdasarkan harga
        if (priceFilter && priceFilter !== '') {
            const [minPrice, maxPrice] = priceFilter.split('-').map(Number);
            if (maxPrice) {
                if (vehicle.price < minPrice || vehicle.price > maxPrice) {
                    return false;
                }
            } else {
                // Untuk range "700000+"
                if (vehicle.price < minPrice) {
                    return false;
                }
            }
        }
        
        return true;
    });
    
    console.log('Filtered vehicles:', filteredVehicles.length);
    displayVehicles(filteredVehicles);
}

// Fungsi untuk mereset filter
function resetFilter() {
    document.getElementById('brandFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('priceFilter').value = '';
    displayVehicles();
}

// Fungsi untuk mendapatkan parameter dari URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        brand: params.get('brand') || '',
        type: params.get('type') || '',
        price: params.get('price') || ''
    };
}

// Fungsi untuk mengisi opsi brand
function populateBrandOptions() {
    const brandFilter = document.getElementById('brandFilter');
    const brands = [...new Set(vehiclesDataLocal.map(vehicle => vehicle.brand))];
    
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });
}

// Fungsi untuk reset data jika ada masalah
function resetVehicleData() {
    console.log('Resetting vehicle data...');
    localStorage.removeItem(VEHICLE_STORAGE_KEY);
    console.log('localStorage cleared');
    return [];
}

// Event listener - tunggu sampai semua script dimuat
window.addEventListener('load', function() {
    console.log('Window loaded');
    
    // Tunggu sebentar untuk memastikan data.js dimuat
    setTimeout(function() {
        console.log('Checking data availability...');
        console.log('window.vehicles available:', !!window.vehicles);
        console.log('window.vehicles type:', typeof window.vehicles);
        console.log('window.vehicles length:', window.vehicles ? window.vehicles.length : 'undefined');
        
        // Update data dari localStorage jika ada perubahan
        vehiclesDataLocal = getVehiclesData();
        
        // Jika tidak ada data, coba reset
        if (vehiclesDataLocal.length === 0) {
            console.log('No data found, resetting...');
            vehiclesDataLocal = resetVehicleData();
        }
        
        console.log('Final vehiclesData:', vehiclesDataLocal);
        console.log('Data mobil berhasil dimuat:', vehiclesDataLocal.length, 'mobil');
        
        // Populate brand options
        populateBrandOptions();
        
        // Get URL parameters
        const urlParams = getUrlParams();
        console.log('URL parameters:', urlParams);
        
        const hasParams = urlParams.brand || urlParams.type || urlParams.price;

        if (hasParams) {
            console.log('Applying filters from URL');
            if (urlParams.brand) {
                document.getElementById('brandFilter').value = urlParams.brand;
            }
            if (urlParams.type) {
                document.getElementById('typeFilter').value = urlParams.type;
            }
            if (urlParams.price) {
                document.getElementById('priceFilter').value = urlParams.price;
            }
            filterVehicles();
        } else {
            console.log('No URL parameters, showing all vehicles');
            displayVehicles();
        }
        
        // Enable the select options (remove disabled attribute)
        const selects = document.querySelectorAll('#brandFilter, #typeFilter, #priceFilter');
        selects.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                option.disabled = false;
            });
        });
    }, 100); // Tunggu 100ms
});

// Fungsi untuk mencari mobil berdasarkan nama (untuk fitur pencarian teks)
function searchVehicles(searchTerm) {
    if (!searchTerm) {
        displayVehicles();
        return;
    }
    
    const filteredVehicles = vehiclesDataLocal.filter(vehicle => 
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displayVehicles(filteredVehicles);
} 