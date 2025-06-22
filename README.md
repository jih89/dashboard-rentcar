# Website Rental Mobil - Trator

Website rental mobil dengan fitur lengkap untuk pelanggan dan admin.

## Fitur yang Telah Diimplementasikan

### 🚗 Fitur Pelanggan

#### 1. **Melihat Daftar Mobil** ✅
- Halaman daftar mobil dengan tampilan kartu yang menarik
- Informasi lengkap mobil (nama, brand, tipe, tahun, harga, dll)
- Badge ketersediaan mobil (Tersedia/Tidak Tersedia)
- Tombol "Lihat Detail" dan "Sewa Sekarang"

#### 2. **Mencari Mobil** ✅
- Filter berdasarkan Brand (Toyota, Honda, Suzuki, dll)
- Filter berdasarkan Tipe (MPV, SUV, Sedan, Hatchback, Pickup)
- Filter berdasarkan Range Harga
- Tombol "Cari Sekarang" untuk menerapkan filter
- Tombol "Reset Filter" untuk menghapus semua filter

#### 3. **Data Mobil** ✅
- 8 mobil dengan data lengkap
- Informasi detail: tahun, transmisi, kapasitas, bahan bakar
- Harga dalam format Rupiah
- Status ketersediaan

#### 4. **Sistem Login** ✅
- Halaman login yang menarik dan responsive
- Validasi form (email dan password)
- Simulasi autentikasi dengan data user
- Remember me functionality
- Redirect ke dashboard berdasarkan role
- Update navbar otomatis setelah login

#### 5. **Dashboard Pelanggan** ✅
- Dashboard dengan informasi user
- Statistik sewa (total sewa, sewa aktif, total pengeluaran)
- Menu aksi cepat (sewa mobil, riwayat sewa, edit profil, hubungi kami)
- Riwayat sewa terbaru dengan tabel
- Efek hover dan animasi yang menarik

#### 6. **Sistem Registrasi** ✅
- Halaman registrasi dengan design modern
- Pilihan role: Customer atau Admin
- Validasi form yang lengkap:
  - Nama lengkap (min. 3 karakter)
  - Email (format valid)
  - Nomor telepon (format Indonesia)
  - Alamat (min. 10 karakter)
  - Password (min. 6 karakter, kombinasi huruf & angka)
  - Konfirmasi password
  - Terms & conditions
- Real-time validation
- Format nomor telepon otomatis
- Cek email duplikat
- Penyimpanan data ke localStorage
- Integrasi dengan sistem login
- Redirect ke login setelah registrasi berhasil

#### 7. **Admin Dashboard** ✅
- Dashboard khusus untuk admin dengan statistik:
  - Total mobil
  - Total users (default + registered)
  - Total bookings (simulasi)
  - Total revenue (simulasi)
- Quick actions:
  - Tambah mobil
  - Kelola users
  - Lihat bookings
  - Generate report
- Recent activities
- Vehicle status (Available, Rented, Maintenance)
- Access control (hanya admin yang bisa akses)
- Real-time data updates
- Hover effects dan animasi

### 8. **Manajemen Data Mobil** ✅
- Halaman manajemen mobil untuk admin (`manage-vehicles.html`)
- Fitur CRUD lengkap:
  - **Create**: Tambah mobil baru dengan form modal
  - **Read**: Tampilkan data dalam tabel dengan gambar
  - **Update**: Edit data mobil dengan form modal
  - **Delete**: Hapus mobil dengan konfirmasi
- Fitur pencarian dan filter:
  - Search berdasarkan nama/brand
  - Filter berdasarkan brand
  - Filter berdasarkan tipe mobil
  - Reset filter
- Sinkronisasi data:
  - Data tersimpan di localStorage
  - Sinkron otomatis dengan data.js
  - Export data ke JSON
  - Import data dari JSON
  - Reset ke data default
- Validasi form yang lengkap
- Alert notifications
- Responsive design

### 9. **Sistem Booking** ✅
- Halaman form pemesanan (`booking.html`) dengan design modern
- Validasi form yang lengkap:
  - Tanggal mulai minimal besok
  - Tanggal selesai harus setelah tanggal mulai
  - Maksimal pemesanan 30 hari
  - Validasi email dan nomor telepon
  - Auto-fill data user jika sudah login
- Kalkulasi harga otomatis berdasarkan durasi
- Preview mobil yang dipilih
- Ringkasan pemesanan real-time
- Penyimpanan data booking ke localStorage
- Update status mobil otomatis (tersedia → disewa)
- Redirect ke halaman pemesanan setelah booking berhasil

### 10. **Halaman My Bookings** ✅
- Halaman daftar pemesanan customer (`my-bookings.html`)
- Statistik pemesanan (pending, aktif, selesai, total)
- Filter berdasarkan status pemesanan
- Pencarian berdasarkan nama mobil
- Kartu pemesanan dengan informasi lengkap:
  - Detail mobil dan tanggal sewa
  - Status pemesanan dengan badge berwarna
  - Total pembayaran
  - Catatan pemesanan
- Fitur aksi pemesanan:
  - Lihat detail pemesanan
  - Batalkan pemesanan (pending/confirmed)
  - Selesai pemesanan (aktif)
  - Print bukti pemesanan
- Update status mobil otomatis saat pembatalan/selesai
- Empty state dengan call-to-action
- Responsive design untuk mobile dan desktop

### 🎨 Desain dan UI/UX

#### 1. **Template yang Konsisten** ✅
- Menggunakan template CSS yang sudah ada
- Responsive design untuk mobile dan desktop
- Animasi hover pada kartu mobil
- Gradient background pada section pencarian

#### 2. **Navigasi Terintegrasi** ✅
- Link ke halaman vehicles di semua halaman
- Link login di navbar semua halaman
- Breadcrumb navigation di halaman vehicles
- Konsistensi dengan halaman lain
- Dropdown menu untuk user yang sudah login

#### 3. **Komponen UI** ✅
- Dropdown filter yang menarik dengan nice-select
- Kartu mobil dengan hover effects
- Tombol dengan styling yang konsisten
- Badge status ketersediaan
- Form login yang modern dan user-friendly

## File yang Dibuat

### 📁 Halaman HTML
- `html/vehicles.html` - Halaman utama daftar mobil
- `html/vehicle-detail.html` - Halaman detail mobil
- `html/login.html` - Halaman login
- `html/dashboard.html` - Dashboard pelanggan
- `html/admin-dashboard.html` - Dashboard admin (BARU!)
- `html/index.html` - Halaman utama (diperbarui)
- `html/register.html` - Halaman registrasi (BARU!)
- `html/manage-vehicles.html` - Halaman manajemen mobil (BARU!)
- `html/booking.html` - Halaman form pemesanan (BARU!)
- `html/my-bookings.html` - Halaman daftar pemesanan customer (BARU!)

### 📁 JavaScript
- `html/js/vehicles.js` - JavaScript untuk fungsi pencarian dan menampilkan data
- `html/js/vehicle-detail.js` - JavaScript untuk halaman detail mobil
- `html/js/login.js` - JavaScript untuk sistem login dan autentikasi
- `html/js/dashboard.js` - JavaScript untuk dashboard pelanggan
- `html/js/jquery.nice-select.min.js` - Plugin untuk dropdown yang menarik
- `html/js/register.js` - JavaScript untuk sistem registrasi (BARU!)
- `html/js/admin-dashboard.js` - JavaScript untuk admin dashboard (BARU!)
- `html/js/manage-vehicles.js` - JavaScript untuk manajemen mobil (BARU!)
- `html/js/booking.js` - JavaScript untuk sistem booking (BARU!)
- `html/js/my-bookings.js` - JavaScript untuk halaman my bookings (BARU!)

### 📁 CSS
- `html/css/vehicles.css` - CSS khusus untuk styling halaman vehicles dan navbar active

## Cara Menggunakan

### 1. **Melihat Daftar Mobil**
- Buka file `html/vehicles.html` di browser
- Atau klik "Vehicles" di navbar dari halaman manapun

### 2. **Mencari Mobil**
- Gunakan filter dropdown untuk mencari berdasarkan:
  - **Brand**: Toyota, Honda, Suzuki, dll
  - **Tipe**: MPV, SUV, Sedan, dll
  - **Harga**: Range harga yang berbeda
- Klik "Cari Sekarang" untuk menerapkan filter
- Klik "Reset Filter" untuk menghapus semua filter

### 3. **Login ke Sistem**
- Klik "Login" di navbar
- Gunakan kredensial berikut:
  - **Pelanggan**: `customer@trator.com` / `customer123`
  - **Admin**: `admin@trator.com` / `admin123`
- Centang "Ingat saya" untuk menyimpan login
- Setelah login berhasil, akan diarahkan ke dashboard

### 4. **Dashboard Pelanggan**
- Melihat informasi profil
- Statistik sewa mobil
- Menu aksi cepat
- Riwayat sewa terbaru
- Akses ke fitur lain

### 5. **Navigasi**
- Klik "Lihat Detail" untuk melihat detail mobil
- Klik "Sewa Sekarang" untuk memesan mobil (akan dibuat selanjutnya)
- Gunakan dropdown menu untuk akses ke dashboard dan logout

### 6. **Registrasi**
- Buka halaman `register.html`
- Pilih role (Customer atau Admin)
- Isi form registrasi dengan data lengkap
- Setujui terms & conditions
- Klik "Daftar Sekarang"
- Setelah berhasil, akan diarahkan ke halaman login

### 7. **Admin Dashboard**
- Login sebagai admin dengan kredensial: `admin@trator.com` / `admin123`
- Atau registrasi dengan role Admin
- Setelah login, akan diarahkan ke `admin-dashboard.html`
- Dashboard menampilkan:
  - Statistik total mobil, users, bookings, dan revenue
  - Quick actions untuk manajemen sistem
  - Recent activities
  - Vehicle status overview
- Hanya admin yang bisa mengakses halaman ini

### 8. **Manajemen Data Mobil**
- Akses dari admin dashboard atau langsung ke `manage-vehicles.html`
- Fitur yang tersedia:
  - **Tambah Mobil**: Klik "Tambah Mobil Baru", isi form, klik "Simpan"
  - **Edit Mobil**: Klik icon edit (pensil) pada baris mobil
  - **Hapus Mobil**: Klik icon hapus (trash) pada baris mobil
  - **Search & Filter**: Gunakan search box dan dropdown filter
  - **Export/Import**: Export data ke JSON atau import dari file JSON
  - **Reset Data**: Klik "Reset ke Default" untuk kembali ke data awal
- Semua perubahan langsung tersimpan di localStorage
- Data sinkron otomatis dengan halaman vehicles.html dan vehicle-detail.html

### 9. **Sistem Booking**
- Login sebagai customer terlebih dahulu
- Buka halaman `vehicles.html` dan pilih mobil yang tersedia
- Klik tombol "Sewa Sekarang" pada mobil yang diinginkan
- Isi form pemesanan dengan data lengkap:
  - Pilih tanggal mulai dan selesai sewa
  - Isi data peminjam (nama, telepon, email, alamat)
  - Tambahkan catatan jika diperlukan
- Review ringkasan pemesanan dan klik "Konfirmasi Pemesanan"
- Setelah berhasil, akan diarahkan ke halaman "My Bookings"

### 10. **My Bookings**
- Akses dari dropdown menu user atau langsung ke `my-bookings.html`
- Halaman menampilkan:
  - Statistik pemesanan (pending, aktif, selesai, total)
  - Daftar pemesanan dengan filter dan pencarian
  - Kartu pemesanan dengan detail lengkap
- Fitur yang tersedia:
  - **Lihat Detail**: Klik tombol "Detail" untuk melihat informasi lengkap
  - **Batalkan**: Klik "Batalkan" untuk membatalkan pemesanan pending/confirmed
  - **Selesai**: Klik "Selesai" untuk menyelesaikan pemesanan aktif
  - **Print**: Klik "Print" untuk mencetak bukti pemesanan
- Filter berdasarkan status: Semua, Pending, Dikonfirmasi, Aktif, Selesai, Dibatalkan
- Pencarian berdasarkan nama mobil atau ID pemesanan

## Data User untuk Testing

| Role | Email | Password | Nama |
|------|-------|----------|------|
| Pelanggan | customer@trator.com | customer123 | John Doe |
| Admin | admin@trator.com | admin123 | Admin Trator |

## Data Mobil Tersedia

| No | Nama Mobil | Brand | Tipe | Tahun | Harga/Hari | Status |
|----|------------|-------|------|-------|------------|--------|
| 1 | Toyota Avanza | Toyota | MPV | 2022 | Rp 350.000 | Tersedia |
| 2 | Honda Brio | Honda | Hatchback | 2021 | Rp 250.000 | Tersedia |
| 3 | Suzuki Ertiga | Suzuki | MPV | 2023 | Rp 400.000 | Tersedia |
| 4 | Daihatsu Xenia | Daihatsu | MPV | 2022 | Rp 300.000 | Tersedia |
| 5 | Mitsubishi Xpander | Mitsubishi | MPV | 2023 | Rp 450.000 | Tersedia |
| 6 | Nissan Livina | Nissan | MPV | 2021 | Rp 380.000 | Tersedia |
| 7 | Toyota Rush | Toyota | SUV | 2023 | Rp 550.000 | Tersedia |
| 8 | Honda CR-V | Honda | SUV | 2022 | Rp 650.000 | Tersedia |

## Fitur Selanjutnya yang Akan Dibuat

### 🚀 Fitur Pelanggan (Next)
1. **Registrasi Akun** - Pendaftaran pelanggan baru
2. **Mengelola Profil** - Edit profil pelanggan
3. **Memesan Mobil** - Form pemesanan
4. **Riwayat Pemesanan** - Daftar pesanan lengkap
5. **Pembayaran** - Simulasi pembayaran
6. **Membatalkan Pemesanan** - Pembatalan pesanan

### 👨‍💼 Fitur Admin (Next)
1. **Dashboard Admin** - Dashboard untuk admin
2. **Mengelola Data Mobil** - CRUD mobil
3. **Mengelola Kategori** - CRUD kategori mobil
4. **Mengelola Pelanggan** - Lihat dan edit data pelanggan
5. **Mengelola Pemesanan** - Lihat dan ubah status pesanan
6. **Laporan** - Laporan pemesanan dan pendapatan

## Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **JavaScript** - Interaktivitas dan fungsi
- **jQuery** - Manipulasi DOM dan AJAX
- **Bootstrap** - Framework CSS untuk responsive design
- **Font Awesome** - Icon library
- **LocalStorage/SessionStorage** - Penyimpanan data user

## Struktur Folder

```
html/
├── index.html          # Halaman utama
├── vehicles.html       # Halaman daftar mobil
├── vehicle-detail.html # Halaman detail mobil
├── login.html          # Halaman login
├── register.html       # Halaman registrasi (BARU!)
├── dashboard.html      # Dashboard pelanggan
├── admin-dashboard.html # Dashboard admin (BARU!)
├── about.html          # Halaman tentang
├── services.html       # Halaman layanan
├── client.html         # Halaman klien
├── contact.html        # Halaman kontak
├── css/
│   ├── style.css       # CSS utama
│   ├── vehicles.css    # CSS khusus vehicles
│   └── responsive.css  # CSS responsive
├── js/
│   ├── vehicles.js     # JavaScript vehicles
│   ├── vehicle-detail.js # JavaScript detail mobil
│   ├── login.js        # JavaScript login
│   ├── dashboard.js    # JavaScript dashboard
│   ├── jquery.nice-select.min.js # Plugin dropdown
│   ├── register.js     # JavaScript registrasi (BARU!)
│   ├── admin-dashboard.js # JavaScript admin dashboard (BARU!)
│   ├── manage-vehicles.js # JavaScript manajemen mobil (BARU!)
│   ├── booking.js      # JavaScript booking (BARU!)
│   └── my-bookings.js  # JavaScript my bookings (BARU!)
└── images/             # Folder gambar
```

## Cara Menjalankan

1. Buka folder `html/` di browser
2. Klik file `index.html` untuk membuka halaman utama
3. Klik "Vehicles" di navbar untuk melihat daftar mobil
4. Klik "Login" untuk masuk ke sistem
5. Gunakan kredensial yang tersedia untuk testing

---

**Status**: ✅ Fitur "Melihat Daftar Mobil", "Mencari Mobil", "Sistem Login", "Dashboard Pelanggan", "Sistem Registrasi", "Admin Dashboard", "Manajemen Data Mobil", dan "Sistem Booking" telah selesai
**Next**: Admin booking management dan sistem pembayaran

## 🔄 Perubahan Terbaru

### Data Management (Latest)
- **Sumber Data Mobil**: Sekarang hanya menggunakan localStorage sebagai sumber data utama
- **Penghapusan Fallback**: Menghapus semua fallback ke `data.js` dan data hardcoded
- **Konsistensi Data**: Semua halaman (vehicles, vehicle-detail, admin-dashboard, manage-vehicles) menggunakan localStorage
- **Data Index.html**: Tetap menggunakan data hardcoded untuk tampilan homepage

### Car Management System
- **CRUD Operations**: Admin dapat menambah, edit, dan hapus mobil
- **Data Persistence**: Semua perubahan disimpan di localStorage
- **Real-time Sync**: Data tersinkronisasi di semua halaman
- **Import/Export**: Fitur untuk backup dan restore data
- **Reset Data**: Opsi untuk mereset ke data kosong

### Login & Registration System
- **User Authentication**: Sistem login dengan role customer dan admin
- **Registration**: Pendaftaran user baru dengan pilihan role
- **Session Management**: Data user disimpan di localStorage/sessionStorage
- **Dashboard Access**: Redirect otomatis ke dashboard sesuai role
- **Auto-Redirect Login**: Deteksi status login dan redirect otomatis ke dashboard

### Auto-Redirect Login Features
- **Login Page Detection**: Halaman login otomatis mendeteksi status login
- **Register Page Detection**: Halaman register otomatis mendeteksi status login
- **Smart Redirect**: Redirect otomatis ke dashboard yang sesuai (admin/customer)
- **Session Persistence**: Menggunakan localStorage untuk "Remember Me" dan sessionStorage untuk session biasa
- **Selective Auto-Redirect**: Auto-redirect hanya berlaku untuk halaman login dan register, tidak untuk halaman lain seperti index, vehicles, dll

### Customer Dashboard
- **User Info**: Menampilkan informasi user yang login
- **Rental Statistics**: Statistik rental (simulasi)
- **Quick Actions**: Tombol aksi cepat untuk booking dan riwayat
- **Recent Rentals**: Daftar rental terbaru (simulasi)

### Admin Dashboard
- **Statistics Overview**: Statistik mobil, rental, dan pendapatan
- **Quick Actions**: Tombol untuk kelola mobil, rental, dan user
- **Navigation**: Link ke halaman manajemen

## 🚗 Car Management Features

### Admin Vehicle Management
- **Add Vehicle**: Form untuk menambah mobil baru
- **Edit Vehicle**: Edit informasi mobil yang ada
- **Delete Vehicle**: Hapus mobil dengan konfirmasi
- **Search & Filter**: Cari dan filter mobil berdasarkan kriteria
- **Data Export**: Export data ke JSON
- **Data Import**: Import data dari file JSON
- **Reset Data**: Reset semua data mobil

### Data Synchronization
- **localStorage Primary**: Semua data mobil disimpan di localStorage
- **Real-time Updates**: Perubahan langsung terlihat di semua halaman
- **No Fallback Data**: Tidak ada data default, admin harus menambah mobil
- **Persistent Storage**: Data tetap ada setelah refresh browser
- **Empty State Messages**: Pesan informatif ketika data mobil kosong di semua halaman
- **Status Synchronization**: Status availability tersinkronisasi antara admin panel dan vehicle pages

### Status Availability Sync
- **Admin Panel**: Menggunakan field `status` dengan nilai 'available', 'rented', 'maintenance'
- **Vehicle Pages**: Mengkonversi status ke boolean `available` untuk kompatibilitas
- **Consistent Data**: Field `available` dan `status` selalu sinkron saat save/edit
- **Default Fields**: Otomatis menambahkan field default (transmission, fuel, seats, features) saat create

### Empty State Handling
- **Vehicles Page**: Pesan "Silahkan tambahkan data dari admin panel terlebih dahulu" dengan tombol ke admin panel
- **Vehicle Detail Page**: Pesan "Mobil tidak ditemukan" dengan opsi kembali ke daftar atau ke admin panel
- **Admin Dashboard**: Pesan "Belum ada data mobil" dengan tombol tambah mobil pertama
- **Manage Vehicles**: Pesan "Belum ada data mobil" dengan tombol tambah mobil pertama

## 📅 Booking System Features

### Customer Booking System
- **Booking Form**: Form pemesanan dengan validasi lengkap
- **Date Validation**: Validasi tanggal mulai minimal besok, maksimal 30 hari
- **Price Calculation**: Kalkulasi harga otomatis berdasarkan durasi
- **Vehicle Preview**: Preview mobil yang dipilih
- **Auto-fill Data**: Auto-fill data user jika sudah login
- **Booking Summary**: Ringkasan pemesanan real-time
- **Status Management**: Update status mobil otomatis (tersedia → disewa)

### My Bookings Management
- **Booking List**: Daftar pemesanan customer dengan statistik
- **Status Filtering**: Filter berdasarkan status pemesanan
- **Search Function**: Pencarian berdasarkan nama mobil atau ID
- **Booking Actions**: Lihat detail, batalkan, selesai, print
- **Status Updates**: Update status mobil saat pembatalan/selesai
- **Print Feature**: Cetak bukti pemesanan
- **Responsive Design**: Tampilan yang responsif untuk mobile dan desktop

### Booking Data Structure
- **localStorage Key**: `trator_bookings`
- **Booking Object**: ID, vehicle info, customer info, dates, price, status
- **Status Flow**: pending → confirmed → active → completed/cancelled
- **Data Persistence**: Semua data booking tersimpan di localStorage
- **User Filtering**: Customer hanya melihat pemesanan mereka sendiri 