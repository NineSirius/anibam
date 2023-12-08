import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { TitleCard } from '@/components/TitleCard'
import styles from './HomePage.module.sass'
import { useRouter } from 'next/router'
import { TitleT } from '../types/TitleT'
import axios from 'axios'
import format from 'date-fns/format'
import ScrollContainer from 'react-indiana-drag-scroll'

export const HomePage = () => {
    const [titles, setTitles] = React.useState<TitleT[]>([])
    const [innerWidth, setInnerWidth] = useState<number>(0)
    const [currentSeason, setCurrentSeason] = useState<null | string>(null)

    useEffect(() => {
        const currentYear = format(new Date(), 'yyyy')
        const currentSeason = format(new Date(), 'Q')
        console.log(currentSeason)

        switch (currentSeason) {
            case '1':
                setCurrentSeason('зимнего')
                break
            case '2':
                setCurrentSeason('весеннего')
                break
            case '3':
                setCurrentSeason('летнего')
                break
            case '4':
                setCurrentSeason('осеннего')
                break
            default:
                break
        }

        axios
            .get(
                `https://api.anilibria.tv/v3/title/search?year=${currentYear}&season_code=${currentSeason}&items_per_page=10`,
            )
            .then((resp) => setTitles(resp.data.list))
        setInnerWidth(window.innerWidth)
    }, [])

    const router = useRouter()

    if (titles.length > 0) {
        return (
            <>
                <Head>
                    <title>Смотреть аниме, фильмы и сериалы на AniBam</title>
                    <meta
                        content="AniBam – Смотреть фильмы, сериалы, аниме и мультфильмы бесплатно"
                        name="description"
                    />
                    <meta
                        content="аниме, смотреть аниме, фильмы, смотреть фильмы, фильмы бесплатно, сериалы, смотреть сериалы, лучшие сериалы, крутые сериалы, мультфильмы, смотреть мультфильмы, мультики, мультики для детей, смотреть мультики для детей"
                        name="keywords"
                    ></meta>
                </Head>
                <div className="container">
                    <h4 className="main_title" style={{ marginBottom: 10 }}>
                        Аниме {currentSeason} сезона
                    </h4>

                    <ScrollContainer className={styles.scroll_container} horizontal hideScrollbars={false}>
                        {titles.map((item, index) => {
                            return (
                                <TitleCard
                                    key={item.id}
                                    poster={`http://anilibria.tv${item.posters.small.url}`}
                                    name={item.names.ru}
                                    code={item.code}
                                />
                            )
                        })}
                    </ScrollContainer>
                </div>
            </>
        )
    }
}
