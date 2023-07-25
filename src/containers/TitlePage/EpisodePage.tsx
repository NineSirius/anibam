import { getTitleByTitle } from '@/api'
import React from 'react'
import styles from './EpisodePage.module.sass'
import { useEffect, useState } from 'react'
import { WatchItemInterface } from '../HomePage'
import { Button } from '@/components/UI/Button'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Link } from '@mui/material'
import { Select } from '@/components/UI/Select'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import clsx from 'clsx'
import { addMonths } from 'date-fns'

export const EpisodePage = () => {
    const [animeInfo, setAnimeInfo] = useState<WatchItemInterface | null>(null)
    const [episodeNumber, setEpisodeNumber] = useState<any | null>(null)
    const [activeEpisode, setActiveEpisode] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (router.query.title) {
            setEpisodeNumber(router.query.episodeNumber)
            setActiveEpisode(`${episodeNumber} серия`)
            getTitleByTitle(router.query.title).then((resp) => setAnimeInfo(resp.data[0]))
        }
    }, [episodeNumber, router.query])

    function extractNumberFromString(string: string) {
        const numberPattern = /\d+/g
        const numbers = string.match(numberPattern)

        if (numbers && numbers.length > 0) {
            const number = parseInt(numbers[0], 10)
            return number
        }

        return null
    }

    const handleEpisodeChange = (value: string) => {
        const episode = extractNumberFromString(value)
        if (animeInfo) {
            router.push(`/watch/${animeInfo.attributes.title_id}/episodes/${episode}`)
        }
    }

    if (animeInfo) {
        return (
            <>
                <Head>
                    <title>
                        Смотреть {animeInfo.attributes.title} - {episodeNumber} серия
                    </title>
                </Head>
                <div className="container">
                    <div className={styles.episode_wrap}>
                        <div
                            className={clsx(
                                styles.episode_video_wrap,
                                animeInfo.attributes.format === 'Фильм' && styles.full,
                            )}
                        >
                            <iframe
                                src={
                                    animeInfo.attributes.episodes[
                                        animeInfo.attributes.episodes.find(
                                            (item) => item.episode_number === '0',
                                        )
                                            ? episodeNumber
                                            : episodeNumber - 1
                                    ].episode_url
                                }
                                width="100%"
                                height="500"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay *; fullscreen *"
                            ></iframe>
                            <div className={styles.episode_info}>
                                <div className={styles.left}>
                                    <h2>
                                        {episodeNumber} серия -{' '}
                                        {animeInfo.attributes.episodes[
                                            animeInfo.attributes.episodes.find(
                                                (item) => item.episode_number === '0',
                                            )
                                                ? episodeNumber
                                                : episodeNumber - 1
                                        ]?.episode_name || 'Без названия'}
                                    </h2>
                                    <Link href={`/watch/${animeInfo.attributes.title_id}`}>
                                        {animeInfo.attributes.title}
                                    </Link>
                                </div>
                                {animeInfo.attributes.format === 'ТВ Сериал' && (
                                    <div className={styles.right}>
                                        <Button
                                            color="primary"
                                            disabled={
                                                +episodeNumber ===
                                                +animeInfo.attributes.episodes[0].episode_number
                                            }
                                            onClick={() =>
                                                router.push(
                                                    `/watch/${
                                                        animeInfo.attributes.title_id
                                                    }/episodes/${+episodeNumber - 1}`,
                                                )
                                            }
                                        >
                                            <MdSkipPrevious size={24} />
                                        </Button>
                                        <Button
                                            color="primary"
                                            disabled={
                                                +episodeNumber ===
                                                +animeInfo.attributes.episodes[
                                                    animeInfo.attributes.episodes.length - 1
                                                ].episode_number
                                            }
                                            onClick={() =>
                                                router.push(
                                                    `/watch/${
                                                        animeInfo.attributes.title_id
                                                    }/episodes/${+episodeNumber + 1}`,
                                                )
                                            }
                                        >
                                            <MdSkipNext size={24} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {animeInfo.attributes.format === 'ТВ Сериал' && (
                            <div className={styles.episode_list}>
                                {animeInfo.attributes.episodes.map((item) => {
                                    return (
                                        <Button
                                            className={
                                                episodeNumber === item.episode_number &&
                                                styles.active_btn
                                            }
                                            key={item.id}
                                            onClick={() =>
                                                router.push(
                                                    `/watch/${animeInfo.attributes.title_id}/episodes/${item.episode_number}`,
                                                )
                                            }
                                        >
                                            {item.episode_number} эпизод
                                        </Button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <Select
                        options={animeInfo.attributes.episodes.map((item) => {
                            return `${item.episode_number} серия - ${item.episode_name}`
                        })}
                        value={activeEpisode || 'Выберите серию'}
                        onChange={handleEpisodeChange}
                        className={styles.episode_list_select}
                    ></Select>
                </div>
            </>
        )
    }
}
