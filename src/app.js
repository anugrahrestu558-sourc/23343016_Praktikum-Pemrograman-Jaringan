const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./geocode')
const prediksiCuaca = require('./prediksiCuaca')

const app = express()

// ===============================
// KONFIGURASI DIREKTORI
// ===============================
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// ===============================
// KONFIGURASI VIEW ENGINE (HBS)
// ===============================
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Aktifkan akses ke file statis
app.use(express.static(direktoriPublic))

// ===============================
// ROUTES HALAMAN UTAMA
// ===============================
app.get('', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Restu Anugrah Prasetyo'
  })
})

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Restu Anugrah Prasetyo'
  })
})

app.get('/bantuan', (req, res) => {
  res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Restu Anugrah Prasetyo',
    teksBantuan: 'Ini adalah teks bantuan.'
  })
})

// ===============================
// HALAMAN BERITA
// ===============================
app.get('/berita', (req, res) => {
  const daftarBerita = [
    {
      judul: 'Cuaca Panas Melanda Sumatera Barat',
      isi: 'BMKG memperkirakan suhu di wilayah Sumatera Barat meningkat hingga 34°C akibat tekanan udara tinggi di Samudera Hindia.'
    },
    {
      judul: 'Hujan Deras Guyur Jakarta',
      isi: 'Hujan deras disertai petir terjadi di beberapa wilayah Jakarta sore ini. Warga diimbau waspada terhadap potensi banjir.'
    },
    {
      judul: 'Universitas Negeri Padang Gelar Seminar Tentang Perubahan Iklim',
      isi: 'Seminar ini membahas dampak perubahan iklim terhadap pertanian lokal dan solusi teknologi ramah lingkungan.'
    }
  ]

  res.render('berita', {
    judul: 'Berita Terkini',
    nama: 'Restu Anugrah Prasetyo',
    daftarBerita
  })
})


// ===============================
// ENDPOINT JSON (DATA STATIS)
// ===============================
app.get('/profil', (req, res) => {
  res.send({
    nama: 'Restu Anugrah Prasetyo',
    asal: 'Padang Pariaman',
    jurusan: 'Informatika',
    kampus: 'Universitas Negeri Padang',
    hobi: ['Public Speaking', 'Desain', 'Ngoding']
  })
})

app.get('/kontak', (req, res) => {
  res.send({
    email: 'restu@example.com',
    instagram: '@restuanugrah_',
    telepon: '0812-3456-7890'
  })
})

// ===============================
// ENDPOINT JSON (INFO CUACA DINAMIS)
// ===============================
app.get('/infoCuaca', (req, res) => {
  const lokasi = req.query.lokasi

  if (!lokasi) {
    return res.send({
      error: 'Harus menyediakan parameter lokasi!'
    })
  }

  let prediksi = ''
  let suhu = ''

  switch (lokasi.toLowerCase()) {
    case 'padang':
      prediksi = 'Hujan ringan disertai angin sepoi-sepoi'
      suhu = '26°C'
      break
    case 'jakarta':
      prediksi = 'Cerah berawan, kemungkinan hujan sore hari'
      suhu = '31°C'
      break
    case 'bandung':
      prediksi = 'Sejuk dan berawan sepanjang hari'
      suhu = '22°C'
      break
    default:
      prediksi = 'Data cuaca untuk lokasi ini belum tersedia'
      suhu = '-'
  }

  res.send({
    lokasi,
    prediksiCuaca: prediksi,
    suhu
  })
})

// ===============================
// ENDPOINT GEOCODE (LATITUDE & LONGITUDE)
// ===============================
app.get('/geocode', (req, res) => {
  if (!req.query.alamat) {
    return res.send({
      error: 'Harus menyediakan parameter alamat!'
    })
  }

  geocode(req.query.alamat, (error, data) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      lokasi: data.lokasi,
      latitude: data.latitude,
      longitude: data.longitude
    })
  })
})

// ===============================
// ENDPOINT PRAKIRAAN CUACA (GABUNG GEOCODE + PREDIKSICUACA)
// ===============================
app.get('/prakiracuaca', (req, res) => {
  if (!req.query.alamat) {
    return res.send({
      error: 'Harus menyediakan parameter alamat!'
    })
  }

  // Ambil koordinat berdasarkan alamat
  geocode(req.query.alamat, (error, dataLokasi) => {
    if (error) {
      return res.send({ error })
    }

    // Ambil prakiraan cuaca berdasarkan koordinat
    prediksiCuaca(dataLokasi.latitude, dataLokasi.longitude, (error, dataCuaca) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        lokasi: dataLokasi.lokasi,
        latitude: dataLokasi.latitude,
        longitude: dataLokasi.longitude,
        prakiraan: dataCuaca.deskripsi,
        suhu: dataCuaca.suhu
      })
    })
  })
})

// ===============================
// HALAMAN 404
// ===============================
app.use((req, res) => {
  res.status(404).render('404', {
    judul: 'Halaman Tidak Ditemukan',
    pesanError: 'Maaf, halaman yang Anda cari tidak tersedia.',
    nama: 'Restu Anugrah Prasetyo'
  })
})

// ===============================
// JALANKAN SERVER
// ===============================
app.listen(4000, () => {
  console.log('Server berjalan pada port 4000.')
})
