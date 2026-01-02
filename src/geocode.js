const geocode = (alamat, callback) => {
  if (!alamat) {
    callback('Alamat tidak valid', undefined);
    return;
  }

  callback(undefined, {
    lokasi: alamat,
    latitude: -0.9492,
    longitude: 100.3543
  });
};

export default geocode;
