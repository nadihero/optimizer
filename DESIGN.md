# Design System - Finance Tracker App

## 1. Project Overview
**Nama App**: Optimizer - Finance Tracker  
**Tujuan**: Aplikasi pencatatan transaksi (pengeluaran & pemasukan) yang simpel, cepat, elegan, dan fokus pada user experience.

**Referensi Utama**: Sleek digital banking landing page dengan glassmorphism, modern fintech aesthetic, dan trust-building colors.

---

## 2. Design Philosophy
- **Minimal & Focused** — Hanya Nominal + Catatan untuk tambah transaksi
- **Fast Input** — Amount input sebagai hero element
- **Modern Fintech Look** — Glassmorphism + vibrant accent
- **Dark Mode First** — Sesuai style awal aplikasi
- **Elegant & Professional** — Menggunakan warna ungu premium

---

## 3. Color Palette (Updated with Main Color #725CFF)

### Primary / Accent
- **Main Color**: `#725CFF` (Violet)
- **Main Hover**: `#8B7AFF`
- **Main Dark**: `#5A4ACC`

### Neutral
- **Background**: `#0F172A` (Slate-950)
- **Surface / Cards**: `rgba(30, 41, 55, 0.75)`
- **Glassmorphism**: `rgba(30, 41, 55, 0.65)`
- **Text Primary**: `#F8FAFC`
- **Text Secondary**: `#94A3B8`
- **Border**: `rgba(255, 255, 255, 0.1)`

### Gradient (Recommended)
- Main Gradient: `linear-gradient(135deg, #725CFF 0%, #A78BFA 100%)`


## 6. UI Components & Glassmorphism Style

**Glassmorphism Card**
```css
background: rgba(30, 41, 55, 0.7);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(114, 92, 255, 0.1);