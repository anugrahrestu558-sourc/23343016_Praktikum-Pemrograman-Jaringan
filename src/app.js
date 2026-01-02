require('dotenv').config();

const path = require('path');
const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

const geocode = require('./geocode');
const prediksiCuaca = require('./prediksiCuaca');


const app = express();

/* ===============================
   SETUP __dirname (WAJIB ES MODULE)
================================ */

/* ===============================
   KONFIGURASI DIREKTORI
================================ */
const direktoriPublic = path.join(__dirname, '../public');
const direktoriViews = path.join(__dirname, '../templates/views');
const direktoriPartials = path.join(__dirname, '../templates/partials');

/* ===============================
   STATIC & VIEW ENGINE
================================ */
app.use(express.static(direktoriPublic));

app.set('view engine', 'hbs');
app.set('views', direktoriViews);
hbs.registerPartials(direktoriPartials);

/* ===============================
   ROUTES
================================ */
app.get('/', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Restu Anugrah Prasetyo'
  });
});

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Restu Anugrah Prasetyo'
  });
});

app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Restu Anugrah Prasetyo',
    teksBantuan: 'Halaman ini digunakan untuk membantu pengguna memahami cara kerja aplikasi.'
  });
});

/* ===============================
   BERITA (MEDIASTACK)
================================ */
app.get('/berita', async (req, res) => {
  try {
    const response = await axios.get('https://api.mediastack.com/v1/news', {
      params: {
        access_key: process.env.MEDIASTACK_KEY || '6da8ac494d7e893e73cb6a1ab01a9ab6',
        countries: 'us',
        limit: 5
      }
    });

    const berita = response.data.data;

    res.render('berita', {
      judul: 'Berita Terkini',
      daftarBerita: berita.length > 0 ? berita : [
        {
          title: 'Contoh Berita',
          description: 'API sedang limit, ini contoh data statis.',
          url: '#'
        }
      ]
    });

  } catch (err) {
    res.render('berita', {
      judul: 'Berita Terkini',
      daftarBerita: [
        {
          title: 'Gagal memuat berita',
          description: 'API MediaStack sedang bermasalah.',
          url: '#'
        }
      ]
    });
  }
});


/* ===============================
   404
================================ */
app.use((req, res) => {
  res.status(404).render('404', {
    judul: 'Halaman Tidak Ditemukan',
    nama: 'Restu Anugrah Prasetyo'
  });
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
