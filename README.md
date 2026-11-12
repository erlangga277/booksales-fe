# BookSales - Frontend Application

Aplikasi web toko buku (*BookSales*) yang dibangun menggunakan **React JS** dan **Vite**, terintegrasi dengan REST API Laravel (Sanctum). Project ini mengimplementasikan manajemen otorisasi, *Role-Based Access Control* (RBAC), dan *Protected Routing* untuk membedakan hak akses antara pengguna umum (*Customer*) dan Administrator (*Admin*).

---

## 🎯 Tujuan & Fitur Otorisasi

Sesuai ketentuan tugas otorisasi dan navigasi berbasis peran:

1. **Role-Based Access Control (RBAC)**:
   - **Customer**: Mengakses katalog buku, melihat detail buku, melakukan pemesanan/pembelian buku, dan mengirim pesan pertanyaan ke admin.
   - **Admin**: Mengakses Dashboard ringkasan, manajemen buku, genre, penulis (authors), pemantauan pesanan (transaksi), daftar user beserta perubahan peran, dan kotak pesan masuk via WhatsApp.
   
2. **Protected Route Guard (`src/routes/ProtectedRoute.jsx`)**:
   - Mencegah akses langsung melalui URL (*direct URL tampering*) ke halaman khusus admin.
   - Mengalihkan pengguna yang belum login atau tidak memiliki peran yang sesuai ke halaman yang diizinkan.

3. **Global State & Session Storage (`src/context/AuthContext.jsx` & `localStorage`)**:
   - Mengelola state login, data pengguna, token autentikasi, serta peran (*role*) secara global menggunakan **React Context API**.
   - Menyimpan sesi login pada `localStorage` sehingga status otentikasi tetap bertahan saat halaman dimuat ulang.

4. **Proteksi Aksi Pengguna**:
   - Pengunjung yang belum memiliki akun/belum login tidak dapat membeli buku maupun mengirimkan pesan ke admin, dan akan diarahkan ke form login terlebih dahulu.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **State Management**: React Context API (`AuthContext`)
- **HTTP Client**: Axios (dengan token interceptor)
- **Styling**: Tailwind CSS & Flowbite
- **Backend API**: Laravel (Sanctum Authentication)

---

## 📁 Struktur Direktori Penting

```text
src/
├── _api/              # Konfigurasi Axios instance & base URL
├── _service/          # Service layer API (auth, book, transaction, user, message)
├── auth/              # Halaman Login dan Registrasi
├── components/        # Komponen UI (Navbar, Hero, Testimonial, dll)
├── context/           # AuthContext untuk manajemen global auth state & role
├── layouts/           # Layout utama Admin & Public
├── pages/
│   ├── admin/         # Halaman terlindungi khusus Admin (Dashboard, Books, Authors, Users, dll)
│   └── public/        # Halaman publik & pelanggan (Home, Books Catalog, Detail, About, Contact)
└── routes/
    └── ProtectedRoute.jsx  # Komponen route guard berdasarkan allowedRoles
```

---

## 🚀 Cara Menjalankan Project

1. **Clone repository dan masuk ke direktori project**:
   ```bash
   git clone <URL_REPO_ANDA>
   cd booksales-fe
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Buat file `.env` di root project jika belum ada:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. Buka di browser: `http://localhost:5173`

---

## 👥 Akun Pengujian (Testing Roles)

| Peran (Role) | Akses Utama |
|---|---|
| **Admin** | Dashboard, Kelola Buku, Genre, Penulis, Daftar User, Pesan WhatsApp |
| **Customer / User** | Beranda, Jelajahi Buku, Beli Buku, Hubungi Admin |
