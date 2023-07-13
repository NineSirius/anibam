import { getTitleByTitle } from '@/api'
import { EpisodePage } from '@/containers/TitlePage/EpisodePage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const EpisodeName: React.FC<{ data: any }> = ({ data }) => {
    const router = useRouter()

    useEffect(() => {
        if (router.query) {
            console.log(router.query)
        }
    }, [router.query])

    if (router.query.title) {
        return <EpisodePage data={data} episodeNumber={router.query.episodeNumber} />
    }
}

export default EpisodeName

export const getServerSideProps = async (context: any) => {
    const data = await getTitleByTitle(context.query.title)
    const res = data.data[0]
    return {
        props: {
            data: res,
        },
    }
}
