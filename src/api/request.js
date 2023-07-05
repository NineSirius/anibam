import ky from 'ky'

const strapiApi = ky.create({
    prefixUrl: 'http://localhost:1337/api',
})

export const getAnime = () => {
    return strapiApi.get('anime?populate=*').json()
}
