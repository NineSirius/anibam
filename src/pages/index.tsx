import { getTitles } from '@/api'
import { HomePage } from '@/containers/HomePage'
import axios from 'axios'

export default function Home({ data }) {
    return <HomePage data={data} />
}

export const getServerSideProps = async () => {
    // const res = await getTitles()
    // const data = await getTitles()

    const res = await axios.get('https://restcountries.com/v3.1/all')
    const data = res.data
    return {
        props: {
            data,
        },
    }
}
