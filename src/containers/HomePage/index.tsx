import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { TitleCard } from '@/components/TitleCard'
import styles from './HomePage.module.sass'
import { useRouter } from 'next/navigation'
import { TitleT } from '../types/TitleT'
import axios from 'axios'
import format from 'date-fns/format'
import ScrollContainer from 'react-indiana-drag-scroll'
import { getAnilibriaSchedule, getAnilibriaTitle } from '@/api'
import Image from 'next/image'
import clsx from 'clsx'
import { Button } from '@/components/UI/Button'
import { AnnounceCard } from './AnnounceCard'
import { SavedTitleCard } from '@/components/SavedTitleCard'

interface SavedTitleT extends TitleT {
    playedInfo: { e: number; t: number; epTime: number }
}

export const HomePage = () => {
    const [titles, setTitles] = useState<TitleT[]>([])
    const [savedTitles, setSavedTitles] = useState<SavedTitleT[]>([])
    const [currentSeason, setCurrentSeason] = useState<null | string>(null)
    const [scheduleToday, setScheduleToday] = useState<TitleT[]>([])
    const [scheduleYesterDay, setScheduleYesterDay] = useState<TitleT[]>([])

    const router = useRouter()

    useEffect(() => {
        const currentYear = format(new Date(), 'yyyy')
        const currentSeason = format(new Date(), 'Q')
        // console.log(currentSeason)

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

        getAnilibriaSchedule().then((resp) => {
            const currentDay = new Date().getDay() - 1
            // console.log(currentDay)

            resp.data[currentDay].list.forEach((item) => {
                getAnilibriaTitle(item.code).then((title) => {
                    if (!scheduleToday.find((item) => item.code === title.code)) {
                        setScheduleToday((prev) => [...prev, title])
                    }
                })
            })

            resp.data[currentDay !== 0 ? currentDay - 1 : 6].list.forEach((item) => {
                getAnilibriaTitle(item.code).then((title) => {
                    if (!scheduleYesterDay.find((item) => item.code === title.code)) {
                        setScheduleYesterDay((prev) => [...prev, title])
                    }
                })
            })
            // setScheduleToday(todayTitles)
            // setScheduleYesterDay(yesterDayTitles)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const savedWatchData = localStorage.getItem('savedWatchData')

        if (savedWatchData) {
            const fetchData = async () => {
                const parsedWatchData = JSON.parse(savedWatchData)
                const data = await parsedWatchData.map(async (item: SavedTitleT) => {
                    const data = await getAnilibriaTitle(item.code)
                    return {
                        ...data,
                        playedInfo: item.playedInfo,
                    }
                })
                Promise.all(data).then((resp) => setSavedTitles(resp.reverse()))
            }
            fetchData()
        }

        // Promise.all(data).then((resp) => console.log(resp))
    }, [])

    if (titles.length > 0) {
        return (
            <>
                <Head>
                    <title>AniBam - Лучший сайт для просмотра аниме.</title>
                    <meta name="color-scheme" content="dark light" />
                    <meta content="AniBam – смотреть аниме на лучшем сайте в мире." name="title" />
                    <meta
                        content="Смотрите аниме в хорошем качестве, а также с нашим удобным плеером."
                        name="description"
                    />
                    <meta
                        content="аниме, смотреть аниме, фильмы, смотреть фильмы, фильмы бесплатно, сериалы, смотреть сериалы, лучшие сериалы, крутые сериалы, мультфильмы, смотреть мультфильмы, мультики, мультики для детей, смотреть мультики для детей"
                        name="keywords"
                    ></meta>
                    <meta content="AniBam – смотреть аниме на лучшем сайте в мире." name="og:title" />
                </Head>
                <div className="container">
                    {savedTitles.length > 0 && (
                        <div className={styles.continue_block}>
                            <h4 className="title">Продолжить просмотр</h4>

                            <ScrollContainer className={styles.continue_block_titles} horizontal>
                                {savedTitles.map((title) => {
                                    return (
                                        <SavedTitleCard
                                            key={title.code}
                                            title={title.names.ru}
                                            poster={`https://anilibria.tv${title.posters.small.url}`}
                                            playedInfo={title.playedInfo}
                                            onClick={() =>
                                                router.push(`/anime/${title.code}/episodes/${title.playedInfo.e}`)
                                            }
                                        />
                                    )
                                })}
                            </ScrollContainer>
                        </div>
                    )}

                    <h4 className="main_title" style={{ marginBottom: 10 }}>
                        Аниме {currentSeason} сезона
                    </h4>

                    <ScrollContainer className={styles.scroll_container} horizontal>
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

                    <div className={clsx(styles.announce, 'container')}>
                        <div className={styles.announce_block}>
                            <h2>Вышло вчера</h2>

                            <div className={styles.announce_block_list}>
                                {scheduleYesterDay.map((title, index) => (
                                    <AnnounceCard
                                        key={index}
                                        title={title}
                                        episodeStr={`${title.player.episodes.last} серия `}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.announce_block}>
                            <h2>Ожидается сегодня</h2>

                            <div className={styles.announce_block_list}>
                                {scheduleToday.map((title, index) => (
                                    <AnnounceCard
                                        key={index}
                                        title={title}
                                        episodeStr={`${title.player.episodes.last + 1} серия `}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button color="primary" onClick={() => router.push('/schedule')}>
                        Смотреть полное расписание
                    </Button>
                </div>
            </>
        )
    }
}
