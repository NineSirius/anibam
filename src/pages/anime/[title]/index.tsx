import { getTitleByTitle } from '@/api'
import { WatchItemInterface } from '@/containers/HomePage'
import { TitlePage } from '@/containers/TitlePage'
import React from 'react'
import { Context } from 'vm'

interface TitleProps {
    data: {
        data: WatchItemInterface[]
        meta: any
    }
}

const Title: React.FC<TitleProps> = ({ data }) => {
    return <TitlePage data={data} />
}

export default Title

export const getServerSideProps = async (context: any) => {
    const res = await getTitleByTitle(context.query.title)
    const data = res

    return { props: { data } }
}
