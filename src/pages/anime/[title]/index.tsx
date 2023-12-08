import { getAnilibriaSchedule, getAnilibriaTitle } from '@/api'
import { TitlePage } from '@/containers/TitlePage'
import { ScheduleT } from '@/containers/types/ScheduleT'
import { TitleT } from '@/containers/types/TitleT'
import { notFound } from 'next/navigation'
import React from 'react'

interface TitleProps {
    titleInfo: TitleT
    schedule: ScheduleT[]
}

const Title: React.FC<TitleProps> = ({ titleInfo, schedule }) => {
    return <TitlePage titleInfo={titleInfo} schedule={schedule} />
}

export default Title

export const getServerSideProps = async (context: any) => {
    try {
        const res = await getAnilibriaTitle(context.query.title)
        const schedleResp = await getAnilibriaSchedule()
        const data = {
            ...res,
            player: {
                ...res.player,
                list: Object.keys(res.player.list).map((key: string) => res.player.list[key]),
            },
        }

        return { props: { titleInfo: data, schedule: schedleResp.data } }
    } catch (error) {
        return notFound()
    }
}
