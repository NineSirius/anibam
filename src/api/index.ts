import ky from 'ky'

const strapiApi = ky.create({
    prefixUrl: 'http://localhost:1337/api',
})
