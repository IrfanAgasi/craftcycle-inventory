-- Update kolom gambar_url untuk menyimpan base64 image (TEXT untuk data lebih besar)
ALTER TABLE produk_jadi MODIFY COLUMN gambar_url TEXT;
