document.addEventListener('DOMContentLoaded', function() {
    // Initial load
    loadOrders();

    // Event listeners for search and filter
    document.getElementById('searchOrder').addEventListener('input', loadOrders);
    document.getElementById('filterStatus').addEventListener('change', loadOrders);
});

// --- Data Retrieval ---

function getBookings() {
    return JSON.parse(localStorage.getItem('trator_bookings')) || [];
}

function getVehicles() {
    return JSON.parse(localStorage.getItem('vehiclesData')) || [];
}

function getUsers() {
    const registered = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const defaults = [
        { id: 'default-customer', name: 'John Doe', email: 'customer@trator.com' },
        { id: 'default-admin', name: 'Admin Trator', email: 'admin@trator.com' }
    ];
    return [...defaults, ...registered];
}

// --- Main Load Function ---

function loadOrders() {
    const allBookings = getBookings();
    const vehicles = getVehicles();
    const users = getUsers();
    const tableBody = document.getElementById('ordersTableBody');
    const noDataMessage = document.getElementById('noDataMessage');

    tableBody.innerHTML = '';

    const vehicleMap = new Map(vehicles.map(v => [v.id, v]));
    const userMap = new Map(users.map(u => [u.id, u]));

    if (allBookings.length === 0) {
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';

    let filteredBookings = filterAndSearch(allBookings, vehicleMap, userMap);

    if (filteredBookings.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 8;
        cell.innerHTML = "Tidak ada pesanan yang cocok dengan kriteria filter.";
        cell.style.textAlign = 'center';
        cell.style.padding = '20px';
        return;
    }
    
    filteredBookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

    filteredBookings.forEach(booking => {
        const vehicle = vehicleMap.get(booking.vehicleId);
        const bookingUserId = booking.userId || booking.customerId; // Fallback for older bookings
        const user = userMap.get(bookingUserId);
        const row = createOrderRow(booking, vehicle, user);
        tableBody.appendChild(row);
    });
}

function filterAndSearch(bookings, vehicleMap, userMap) {
    const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;

    return bookings.filter(booking => {
        const vehicle = vehicleMap.get(booking.vehicleId);
        const bookingUserId = booking.userId || booking.customerId; // Fallback for older bookings
        const user = userMap.get(bookingUserId);

        const searchMatch = !searchTerm ||
            booking.id.toLowerCase().includes(searchTerm) ||
            (vehicle && vehicle.name.toLowerCase().includes(searchTerm)) ||
            (user && user.name.toLowerCase().includes(searchTerm));

        const statusMatch = !statusFilter || booking.status === statusFilter;

        return searchMatch && statusMatch;
    });
}

function resetFilters() {
    document.getElementById('searchOrder').value = '';
    document.getElementById('filterStatus').value = '';
    loadOrders();
}

// --- UI Rendering ---

function createOrderRow(booking, vehicle, user) {
    const row = document.createElement('tr');

    // Handle different date structures for backward compatibility
    const startDate = booking.bookingDates ? booking.bookingDates.start : booking.startDate;
    const endDate = booking.bookingDates ? booking.bookingDates.end : booking.endDate;
    const formattedDate = startDate && endDate 
        ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` 
        : 'Tanggal tidak valid';

    row.innerHTML = `
        <td><strong>${booking.id}</strong></td>
        <td>${user ? user.name : 'Pengguna tidak ditemukan'}</td>
        <td>${booking.vehicleId}</td>
        <td>${vehicle ? vehicle.name : 'Mobil tidak ditemukan'}</td>
        <td>${formattedDate}</td>
        <td>${formatCurrency(booking.totalPrice)}</td>
        <td>${getStatusBadge(booking.status)}</td>
        <td class="action-buttons">${getActionButtons(booking)}</td>
    `;
    return row;
}

function getStatusBadge(status) {
    const statusMap = {
        pending: { text: 'Menunggu', class: 'secondary' },
        accepted: { text: 'Diterima', class: 'primary' },
        finished: { text: 'Selesai', class: 'success' },
        rejected: { text: 'Ditolak', class: 'danger' }
    };
    const { text, class: badgeClass } = statusMap[status] || { text: 'Unknown', class: 'dark' };
    return `<span class="badge badge-${badgeClass}">${text}</span>`;
}

function getActionButtons(booking) {
    let buttons = '';
    if (booking.status === 'pending') {
        buttons += `<button class="btn btn-sm btn-success mr-1" onclick="acceptOrder('${booking.id}')">Terima</button>`;
        buttons += `<button class="btn btn-sm btn-danger" onclick="rejectOrder('${booking.id}')">Tolak</button>`;
    } else if (booking.status === 'accepted') {
        buttons += `<button class="btn btn-sm btn-info" onclick="finishOrder('${booking.id}')">Selesaikan</button>`;
    } else {
        buttons = '<span>-</span>';
    }
    return buttons;
}

// --- Actions ---

function acceptOrder(bookingId) {
    updateBookingStatus(bookingId, 'accepted');
}

function rejectOrder(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        updateVehicleStatus(booking.vehicleId, 'available');
        updateBookingStatus(bookingId, 'rejected');
    }
}

function finishOrder(bookingId) {
    const bookings = getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        updateVehicleStatus(booking.vehicleId, 'available');
        updateBookingStatus(bookingId, 'finished');
    }
}

// --- Data Persistence ---

function updateBookingStatus(bookingId, newStatus) {
    let bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings[index].status = newStatus;
        localStorage.setItem('trator_bookings', JSON.stringify(bookings));
        loadOrders();
    }
}

function updateVehicleStatus(vehicleId, newStatus) {
    let vehicles = getVehicles();
    const index = vehicles.findIndex(v => v.id == vehicleId);
    if (index !== -1) {
        vehicles[index].status = newStatus;
        localStorage.setItem('vehiclesData', JSON.stringify(vehicles));
    }
}

// --- Utilities ---

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
} 