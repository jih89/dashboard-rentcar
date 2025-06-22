document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    document.getElementById('searchUser').addEventListener('input', loadUsers);
    document.getElementById('filterRole').addEventListener('change', loadUsers);
    
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserChanges();
        });
    }
});

function getAllUsers() {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const defaultUsers = [
        { id: 'default-customer', name: 'John Doe', email: 'customer@trator.com', role: 'customer', createdAt: new Date().toISOString() },
        { id: 'default-admin', name: 'Admin Trator', email: 'admin@trator.com', role: 'admin', createdAt: new Date().toISOString() }
    ];
    return [...defaultUsers, ...registeredUsers];
}

function loadUsers() {
    let users = getAllUsers();
    const usersTableBody = document.getElementById('usersTableBody');
    const searchTerm = document.getElementById('searchUser').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;

    if (searchTerm) {
        users = users.filter(user => user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm));
    }

    if (roleFilter) {
        users = users.filter(user => user.role === roleFilter);
    }
    
    if (!usersTableBody) return;
    
    usersTableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-${user.role === 'admin' ? 'success' : 'secondary'}">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    });
}

function resetFilters() {
    document.getElementById('searchUser').value = '';
    document.getElementById('filterRole').value = '';
    loadUsers();
}

function editUser(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.id === userId);

    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserRole').value = user.role;
        
        $('#editUserModal').modal('show');
    }
}

function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        id: userId,
        name: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        role: document.getElementById('editUserRole').value,
    };

    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = registeredUsers.findIndex(u => u.id === userId);

    if (userIndex > -1) {
        // Preserve createdAt date
        updatedUser.createdAt = registeredUsers[userIndex].createdAt;
        registeredUsers[userIndex] = updatedUser;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        $('#editUserModal').modal('hide');
        loadUsers();
    } else {
        alert('Tidak dapat menyimpan perubahan. Pengguna default tidak dapat diubah.');
    }
}

function deleteUser(userId) {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
        let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = registeredUsers.findIndex(u => u.id === userId);

        if (userIndex > -1) {
            registeredUsers.splice(userIndex, 1);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            loadUsers();
        } else {
            alert('Tidak dapat menghapus pengguna. Pengguna default tidak dapat dihapus.');
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    window.location.href = 'index.html';
} 