import { getTitles } from '@/api'
import { HomePage, WatchItemInterface } from '@/containers/HomePage'

interface HomeProps {
    data: {
        data: WatchItemInterface[]
        meta: any
    }
}

const Home: React.FC<HomeProps> = ({ data }) => {
    return <HomePage data={data} />
}

export default Home

export const getServerSideProps = async () => {
    // const res = await getTitles()
    // const data = await getTitles()

    const res = await getTitles()
    const data = res?.data
    return {
        props: {
            data,
        },
    }
}
