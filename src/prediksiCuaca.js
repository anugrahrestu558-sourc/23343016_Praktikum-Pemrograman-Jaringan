const prediksiCuaca = (latitude, longitude, callback) => {
  // Simulasi delay seperti permintaan ke API cuaca asli
  setTimeout(() => {
    if (!latitude || !longitude) {
      callback('Koordinat tidak valid!', undefined)
    } else {
      callback(undefined, {
        deskripsi: 'Cerah berawan dengan kemungkinan hujan sore hari',
        suhu: '28°C',
        latitude,
        longitude
      })
    }
  }, 1000) // simulasi waktu respon API
}

module.exports = prediksiCuaca
