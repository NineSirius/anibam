import { getTitleByTitle } from '@/api'
import { WatchItemInterface } from '@/containers/HomePage'
import { TitlePage } from '@/containers/TitlePage'
import React from 'react'
import { Context } from 'vm'

const Title = () => {
    return <TitlePage />
}

export default Title

// export const getServerSideProps = async (context: any) => {
//     const res = await getTitleByTitle(context.query.title)
//     const data = res

//     return { props: { data } }
// }
