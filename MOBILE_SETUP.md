# Setup Aplikasi Mobile POS

Aplikasi POS sudah dikonfigurasi untuk berjalan sebagai aplikasi mobile menggunakan Capacitor. Berikut langkah-langkah untuk menjalankan di HP:

## 🚀 Langkah-langkah Setup

### 1. Export ke Github
- Klik tombol "Export to Github" di Lovable
- Clone project ke komputer lokal Anda

### 2. Install Dependencies
```bash
cd [nama-project]
npm install
```

### 3. Tambah Platform Mobile
```bash
# Untuk Android
npx cap add android

# Untuk iOS (hanya di Mac)
npx cap add ios
```

### 4. Build & Sync
```bash
npm run build
npx cap sync
```

### 5. Jalankan di Device
```bash
# Untuk Android
npx cap run android

# Untuk iOS
npx cap run ios
```

## 📱 Fitur Mobile Thermal Printing

### Yang Dibutuhkan:
1. **Aplikasi Printer Thermal** di HP Anda:
   - Bluetooth Thermal Printer
   - POS Thermal Printer
   - Epson iPrint
   - StarPRNT

### Cara Cetak:
1. Buat transaksi seperti biasa
2. Klik tombol "Cetak" pada nota
3. Pilih aplikasi printer dari menu share
4. Aplikasi printer akan otomatis format dan cetak

### Keunggulan Mobile:
- ✅ Tidak perlu koneksi Bluetooth manual
- ✅ Format thermal otomatis
- ✅ Integrasi dengan aplikasi printer existing
- ✅ Bekerja di Android & iOS
- ✅ Offline capable

## 🔧 Troubleshooting

### Jika tidak bisa build:
```bash
npx cap doctor
```

### Update dependencies:
```bash
npx cap update android
# atau
npx cap update ios
```

## 📖 Dokumentasi Lengkap
Baca panduan lengkap di: https://lovable.dev/blogs/TODO

---

**Catatan**: Aplikasi akan otomatis mendeteksi environment mobile dan menampilkan panduan cetak thermal yang sesuai.