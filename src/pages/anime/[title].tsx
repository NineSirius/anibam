import { getTitleByTitle } from '@/api'
import { TitlePage } from '@/containers/TitlePage'
import React from 'react'
import { Context } from 'vm'

export const Title = ({ data }) => {
    return <TitlePage data={data} />
}

export const getServerSideProps = async (context) => {
    const res = await getTitleByTitle(context.query)
    const data = res

    return { props: { data } }
}
