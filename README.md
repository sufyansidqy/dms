# Document Management System (DMS)

**Centralized • Secure • Project-Based** - A system to manage technical documents with version control and approval workflows.

---

## 📋 Deskripsi

DMS adalah aplikasi web untuk mengelola dokumen teknis dalam sebuah organisasi berbasis proyek. Aplikasi ini memungkinkan:

- **Interactive Review**: Review dokumen dengan komentar per-baris (Line-based Comments).
- **Threaded Replies**: Diskusi berjenjang pada komentar.
- **Project-Based RBAC**: Akses berbasis peran per proyek (Reviewer, Creator, Viewer).
- **Control**: Admin memiliki kendali penuh atas manajemen user dan proyek.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | Frontend & Backend (App Router) |
| **TypeScript** | Type-safe development |
| **Prisma** | ORM & Database management |
| **SQLite** | Database (Simple & Portable) |
| **NextAuth.js** | Authentication (Google OAuth 2.0) |
| **Tailwind CSS** | Styling |

---

## 🗺️ Menu Map

### User (General)
```
├── Dashboard
│   ├── Proyek Aktif
│   └── Dokumen Pending Review
├── Projects
│   └── Project Detail
│       ├── Document List
│       └── Upload Document
```

### Editor
```
├── My Documents
│   ├── Drafts
│   └── Rejected Documents (for revision)
└── Document Editor
    ├── Inline Edit
    └── Save as New Version
```

### Approver
```
├── Pending Reviews
│   ├── View Diff (Changes)
│   ├── Comment on Changes
│   └── Approve / Reject
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Instalasi

```bash
# Clone repository
git clone https://github.com/sufyansidqy/dms.git
cd dms

# Install dependencies
npm install

# Setup database (Phase 2)
# npx prisma generate
# npx prisma db push

# Jalankan development server
npm run dev
```

### Environment Variables

Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:

```bash
cp .env.example .env
```

Isi file `.env` (Coming Soon in Phase 2).

### Akses Aplikasi

Buka browser dan akses: **http://localhost:3000**

---

## 📄 License

© 2026. All rights reserved.
