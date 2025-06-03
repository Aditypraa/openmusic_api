# OpenMusic API

API untuk aplikasi pemutar musik OpenMusic yang menyediakan endpoint untuk mengelola album dan lagu.

## Fitur

- CRUD Album (Create, Read, Update, Delete)
- CRUD Songs (Create, Read, Update, Delete)
- Data validation menggunakan Joi
- Database PostgreSQL dengan migrations
- Error handling yang komprehensif
- Query parameter untuk pencarian lagu (title, performer)
- Menampilkan daftar lagu dalam detail album

## Persyaratan

- Node.js (v14 atau lebih baru)
- PostgreSQL
- npm atau yarn

## Installation

1. Clone repository:

```bash
git clone <repository-url>
cd openmusic-api
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi database Anda.

4. Buat database PostgreSQL:

```sql
CREATE DATABASE openmusic_api;
```

5. Test koneksi database:

```bash
npm run test:db
```

6. Jalankan migrations:

```bash
npm run migrate:up
```

7. (Opsional) Setup sample data untuk testing:

```bash
npm run setup:sample
```

8. Jalankan server:

```bash
npm start
```

Server akan berjalan di `http://localhost:4000` (atau port yang dikonfigurasi di .env)

## Testing API

Lihat file `API_EXAMPLES.md` untuk contoh-contoh request API yang dapat digunakan untuk testing.

Atau gunakan tools seperti:

- Postman
- Insomnia
- Thunder Client (VS Code extension)
- curl (command line)

## API Endpoints

### Albums

- `POST /albums` - Tambah album baru
- `GET /albums/{id}` - Dapatkan album berdasarkan ID (termasuk daftar lagu)
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Hapus album

### Songs

- `POST /songs` - Tambah lagu baru
- `GET /songs` - Dapatkan semua lagu (dengan query parameter opsional)
- `GET /songs/{id}` - Dapatkan lagu berdasarkan ID
- `PUT /songs/{id}` - Update lagu
- `DELETE /songs/{id}` - Hapus lagu

### Query Parameters untuk Songs

- `?title=keyword` - Cari lagu berdasarkan judul
- `?performer=keyword` - Cari lagu berdasarkan performer
- Kombinasi: `?title=keyword&performer=keyword`

## Development

Untuk development dengan auto-reload:

```bash
npm run dev
```

## Scripts

- `npm start` - Menjalankan server production
- `npm run dev` - Menjalankan server development dengan nodemon
- `npm run test:db` - Test koneksi database
- `npm run migrate:up` - Menjalankan migrations
- `npm run migrate:down` - Rollback migrations
- `npm run setup:sample` - Setup sample data untuk testing

## Environment Variables

- `HOST` - Host server (default: localhost)
- `PORT` - Port server (default: 3000)
- `PGUSER` - Username database PostgreSQL
- `PGPASSWORD` - Password database PostgreSQL
- `PGDATABASE` - Nama database PostgreSQL
- `PGHOST` - Host database PostgreSQL
- `PGPORT` - Port database PostgreSQL
- `DATABASE_URL` - URL lengkap database untuk migrations
