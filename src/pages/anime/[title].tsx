import { getTitleByTitle } from '@/api'
import { TitlePage } from '@/containers/TitlePage'
import React from 'react'
import { Context } from 'vm'

const Title = ({ data }) => {
    return <TitlePage data={data} />
}

export default Title

export const getServerSideProps = async (context) => {
    const res = await getTitleByTitle(context.query.title)
    const data = res

    return { props: { data } }
}
