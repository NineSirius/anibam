import { getAnilibriaTitle } from '@/api'
import { TitlePage } from '@/containers/TitlePage'
import { TitleT } from '@/containers/types/TitleT'
import React from 'react'

interface TitleProps {
    titleInfo: TitleT
}

const Title: React.FC<TitleProps> = ({ titleInfo }) => {
    return <TitlePage titleInfo={titleInfo} />
}

export default Title

export const getServerSideProps = async (context: any) => {
    const res = await getAnilibriaTitle(context.query.title)
    const data = {
        ...res,
        player: {
            ...res.player,
            list: Object.keys(res.player.list).map((key: string) => res.player.list[key]),
        },
    }

    return { props: { titleInfo: data } }
}
