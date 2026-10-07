# Edamos Barbershop

**Sistem Informasi Reservasi Online dan Penggajian Karyawan pada Edamos Barbershop**  
*Tugas Laboratorium Konsep Sistem Informasi - Universitas Komputer Indonesia*

---

## 1. Deskripsi Project
Edamos Barbershop adalah sistem informasi berbasis web yang dirancang untuk mengotomatisasi proses operasional pada Edamos Barbershop (berlokasi di Katapang, Kabupaten Bandung). Sistem ini menggantikan pencatatan manual buku tulis dan WhatsApp menjadi alur digital terintegrasi antara pemesanan pelanggan, pencatatan kas harian, catatan kinerja kapster, hingga kalkulasi penggajian bulanan berbasis kinerja.

## 2. Tujuan Project
- Mengotomatisasi pengelolaan reservasi online pelanggan dengan validasi anti *double booking*.
- Mempercepat pencatatan transaksi kasir harian dan pelaporan pendapatan (harian & bulanan).
- Menyediakan transparansi perhitungan laba kotor dan alokasi dana gaji (50% dari laba kotor).
- Mengurangi waktu penyusunan rekapitulasi gaji karyawan dan menerbitkan slip gaji digital.

## 3. Fitur Utama
1. **Pengelolaan Reservasi & Penjadwalan Kapster**: Pemesanan layanan potong rambut dengan alokasi kapster dan pencegahan jadwal bentrok.
2. **Manajemen Pelanggan**: Pencatatan riwayat kontak, WhatsApp, dan preferensi layanan pelanggan.
3. **Katalog Layanan & Tarif**: Pengaturan jenis layanan (Haircut, Styling, Coloring, Perming, Treatment) dan durasi estimasi.
4. **Pencatatan Transaksi & Kasir**: Pembayaran tunai (Cash) dan non-tunai (QRIS / Transfer) dengan pencatatan invoice.
5. **Catatan Kinerja Karyawan**: Rekapitulasi layanan yang telah diselesaikan oleh kapster dan keandalan operasional administrasi.
6. **Perhitungan Penggajian (Payroll)**: Kalkulasi laba kotor (omzet dikurangi biaya operasional), alokasi pool gaji, bagi hasil komisi proporsional, serta slip gaji digital.
7. **Laporan Pendapatan**: Rekap pendapatan harian dan bulanan otomatis.

## 4. Struktur Organisasi Tim
- **Pemilik (Owner)**: Pengambil keputusan keuangan, penentu alokasi gaji, pembuat slip gaji & laporan total gaji.
- **Administrasi (Admin)**: 1 orang – Operator pemesanan, verifikasi jadwal di toko, kasir transaksi, dan pencatat kinerja.
- **Kapster**: 3 orang (Rizky Fauzan, Dimas Pratama, Yoga Kurnia) – Penyedia jasa layanan pangkas rambut.

## 5. Teknologi yang Digunakan
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 6. Struktur Folder Singkat
```text
EdamosBarbershop/
├── prisma/
│   ├── migrations/       # SQL Migration awal (0_init)
│   ├── schema.prisma     # Definisi skema database & relasi
│   └── seed.ts           # Data dummy realistis (Owner, Admin, 3 Kapster, dll)
├── public/               # Asset statis
├── src/
│   ├── app/              # Next.js App Router (Halaman & Layout)
│   │   ├── layout.tsx    # Root layout dengan Sidebar & Header
│   │   ├── page.tsx      # Dashboard utama
│   │   ├── reservasi/    # Halaman Reservasi
│   │   ├── pelanggan/    # Halaman Pelanggan
│   │   ├── layanan/      # Halaman Layanan
│   │   ├── transaksi/    # Halaman Kas Harian
│   │   ├── karyawan/     # Halaman Manajemen Karyawan
│   │   ├── penggajian/   # Halaman Penggajian & Slip Gaji
│   │   └── laporan/      # Halaman Laporan Pendapatan
│   ├── components/       # Komponen UI (Sidebar, Header)
│   ├── lib/              # Utilitas & Prisma Client singleton
│   └── types/            # Definisi TypeScript interface
├── .env.example          # Template konfigurasi environment
├── .gitignore            # Pengabaian file sensitif
├── package.json          # Dependency & script project
└── README.md             # Dokumentasi project
```

## 7. Cara Menjalankan Project

### A. Clone & Install Dependencies
```bash
git clone https://github.com/Acelinoo/EdamosBarbershop.git
cd EdamosBarbershop
npm install
```

### B. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi PostgreSQL Anda pada file `.env`:
```env
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/edamos_barbershop?schema=public"
```

### C. Menjalankan Prisma ORM
1. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```
2. **Push Skema ke Database** (saat PostgreSQL lokal/server sudah aktif):
   ```bash
   npx prisma db push
   # atau menggunakan migration:
   npx prisma migrate deploy
   ```
3. **Menjalankan Seed Data**:
   ```bash
   npm run prisma:seed
   ```

### D. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

## 8. Status Development
- [x] Fondasi project Next.js + TypeScript + Tailwind CSS aktif.
- [x] Skema database ternormalisasi dengan Prisma ORM selesai dirancang.
- [x] Skrip migration awal & seed data realistis selesai dibuat.
- [x] Komponen navigasi, header, dashboard, dan placeholder seluruh halaman modul selesai dibuat dalam Bahasa Indonesia.
- [x] Struktur project bersih, aman (tanpa credentials di Git), dan siap untuk First Commit.
