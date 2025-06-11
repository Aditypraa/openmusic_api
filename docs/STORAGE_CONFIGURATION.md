# Storage Configuration Guide

## Overview

OpenMusic API mendukung dua jenis storage untuk file upload:

- **Local Storage**: Menyimpan file di server lokal (default)
- **S3 Storage**: Menyimpan file di Amazon S3

## Cara Mengubah Storage

### 1. Menggunakan Local Storage (Default)

Set `STORAGE_TYPE=local` di file `.env` atau hapus variable ini:

```bash
# Storage Configuration
STORAGE_TYPE=local
```

Atau cukup comment/hapus baris `STORAGE_TYPE`:

```bash
# STORAGE_TYPE=local
```

### 2. Menggunakan S3 Storage

Set `STORAGE_TYPE=s3` di file `.env` dan pastikan semua AWS credentials terisi:

```bash
# Storage Configuration
STORAGE_TYPE=s3

# AWS S3 Configuration
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## Environment Variables untuk S3

| Variable                | Deskripsi                    | Contoh                                     |
| ----------------------- | ---------------------------- | ------------------------------------------ |
| `STORAGE_TYPE`          | Jenis storage yang digunakan | `s3` atau `local`                          |
| `AWS_BUCKET_NAME`       | Nama S3 bucket               | `openmusic-covers`                         |
| `AWS_REGION`            | AWS region                   | `ap-southeast-1`                           |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key ID            | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key        | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

## Setup AWS S3

### 1. Buat S3 Bucket

1. Login ke AWS Console
2. Buka S3 service
3. Klik "Create bucket"
4. Isi nama bucket dan pilih region
5. Set bucket untuk public read (untuk mengakses cover album)

### 2. Buat IAM User

1. Buka IAM service di AWS Console
2. Klik "Users" → "Add user"
3. Pilih "Programmatic access"
4. Attach policy "AmazonS3FullAccess" atau buat custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Set Bucket Policy (Opsional)

Untuk memungkinkan public read access pada cover album:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## Features

### Auto Fallback

Jika S3 tidak dikonfigurasi dengan benar, aplikasi akan otomatis fallback ke Local Storage:

```
❌ Missing S3 environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
🔄 Falling back to Local Storage
📁 Using Local Storage Service
```

### Logging

Aplikasi akan menampilkan storage service yang digunakan saat startup:

```
🚀 Using S3 Storage Service
```

atau

```
📁 Using Local Storage Service
```

## Testing

### Test Local Storage

```bash
# Set storage ke local
export STORAGE_TYPE=local
npm run dev
```

### Test S3 Storage

```bash
# Set storage ke S3 (pastikan AWS credentials benar)
export STORAGE_TYPE=s3
npm run dev
```

## Troubleshooting

### Error: Missing S3 environment variables

**Solusi**: Pastikan semua AWS environment variables terisi dengan benar.

### Error: Access Denied

**Solusi**:

1. Cek IAM permissions
2. Pastikan bucket policy mengizinkan operasi yang diperlukan
3. Cek AWS credentials valid

### Error: Bucket not found

**Solusi**: Pastikan bucket name dan region benar.

### File tidak bisa diakses secara public

**Solusi**: Set bucket policy untuk public read access pada file yang diupload.
