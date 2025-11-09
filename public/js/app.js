console.log('Client-side JavaScript berhasil dimuat!')

const form = document.querySelector('#form-cuaca')
const input = document.querySelector('input')
const pesan1 = document.querySelector('#pesan-1')
const pesan2 = document.querySelector('#pesan-2')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const lokasi = input.value

    pesan1.textContent = 'Memuat data cuaca...'
    pesan2.textContent = ''

    fetch('/prakiracuaca?alamat=' + lokasi).then(response => {
        response.json().then(data => {
            if (data.error) {
                pesan1.textContent = data.error
            } else {
                pesan1.textContent = data.lokasi
                pesan2.textContent = 
                    `Info Cuaca: ${data.prakiraan}. Suhu: ${data.suhu}.`
            }
        })
    })
})
