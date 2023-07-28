import { getAnilibriaTitle, getTitleByTitle } from '@/api'
import { EpisodePage } from '@/containers/TitlePage/EpisodePage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

interface EpisodeProps {
    titleInfo: any
    episodeNumber: number
}

const EpisodeName: React.FC<EpisodeProps> = ({ titleInfo, episodeNumber }) => {
    return <EpisodePage titleInfo={titleInfo} episodeNumber={+episodeNumber} />
}

export default EpisodeName

export const getServerSideProps = async (context: any) => {
    const data = await getAnilibriaTitle(context.query.title)
    const res = {
        ...data,
        player: {
            ...data.player,
            list: Object.keys(data.player.list).map((key: string) => data.player.list[key]),
        },
    }
    return {
        props: {
            titleInfo: res,
            episodeNumber: context.query.episodeNumber,
        },
    }
}
