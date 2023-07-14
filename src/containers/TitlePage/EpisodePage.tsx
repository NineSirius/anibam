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

export const EpisodePage = () => {
    const [animeInfo, setAnimeInfo] = useState<WatchItemInterface | null>(null)
    const [episodeNumber, setEpisodeNumber] = useState<any | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (router.query.title) {
            setEpisodeNumber(router.query.episodeNumber)
            getTitleByTitle(router.query.title).then((resp) => setAnimeInfo(resp.data[0]))
        }
    }, [router.query])

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
                        <div className={styles.episode_video_wrap}>
                            <iframe
                                src={animeInfo.attributes.episodes[episodeNumber - 1].episode_url}
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
                                        {animeInfo.attributes.episodes[episodeNumber - 1]
                                            ?.episode_name || 'Без названия'}
                                    </h2>
                                    <Link href={`/anime/${animeInfo.attributes.title_id}`}>
                                        {animeInfo.attributes.title}
                                    </Link>
                                </div>
                                <div className={styles.right}>
                                    <Button
                                        disabled={+episodeNumber === 1}
                                        onClick={() =>
                                            router.push(
                                                `/anime/${animeInfo.attributes.title_id}/episodes/${
                                                    +episodeNumber - 1
                                                }`,
                                            )
                                        }
                                    >
                                        <MdSkipPrevious size={24} />
                                    </Button>
                                    <Button
                                        disabled={
                                            +episodeNumber === animeInfo.attributes.episodes.length
                                        }
                                        onClick={() =>
                                            router.push(
                                                `/anime/${animeInfo.attributes.title_id}/episodes/${
                                                    +episodeNumber + 1
                                                }`,
                                            )
                                        }
                                    >
                                        <MdSkipNext size={24} />
                                    </Button>
                                </div>
                            </div>
                        </div>

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
                                                `/anime/${animeInfo.attributes.title_id}/episodes/${item.episode_number}`,
                                            )
                                        }
                                    >
                                        {item.episode_number} эпизод
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                    {/* <Select
                        options={animeInfo.attributes.episodes.map(
                            (item) => `${item.episode_number} серия`,
                        )}
                        value={`${episodeNumber} серия`}
                        onChange={(value) => {
                            const episodeNumber = parseInt(value) // Преобразование строки в число

                            if (!isNaN(episodeNumber)) {
                                console.log(episodeNumber)
                                router.push(
                                    `/anime/${animeInfo.attributes.title_id}/episodes/${episodeNumber}`,
                                )
                            } else {
                                console.log('Невозможно извлечь число из строки')
                            }
                        }}
                    ></Select> */}
                </div>
            </>
        )
    }
}
