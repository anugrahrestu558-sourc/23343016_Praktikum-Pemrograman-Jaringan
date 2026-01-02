const prediksiCuaca = (lat, lon, callback) => {
  callback(undefined, {
    deskripsi: 'Cerah berawan',
    suhu: '28°C'
  });
};

export default prediksiCuaca;
