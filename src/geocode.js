const geocode = (alamat, callback) => {
  // Simulasi koordinat berdasarkan nama kota
  setTimeout(() => {
    const dataLokasi = {
      Padang: { latitude: -0.9492, longitude: 100.3543 },
      Jakarta: { latitude: -6.2088, longitude: 106.8456 },
      Bandung: { latitude: -6.9175, longitude: 107.6191 }
    }

    const hasil = dataLokasi[alamat]

    if (!hasil) {
      callback('Lokasi tidak ditemukan', undefined)
    } else {
      callback(undefined, {
        lokasi: alamat,
        latitude: hasil.latitude,
        longitude: hasil.longitude
      })
    }
  }, 1000) // delay 1 detik simulasi request
}

module.exports = geocode
