import { getAnilibriaTitle, getTitleByTitle } from '@/api'
import React from 'react'
import styles from './EpisodePage.module.sass'
import { useEffect, useState } from 'react'
import { Button } from '@/components/UI/Button'
import { useParams, useRouter } from 'next/navigation'
import Head from 'next/head'
import { Select } from '@/components/UI/Select'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import clsx from 'clsx'
import { TitleT, hlsT, playerListT } from '../types/TitleT'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'

export const EpisodePage = () => {
    const [titleInfo, setTitleInfo] = useState<TitleT | null>(null)
    const [episodeNumber, setEpisodeNumber] = useState<number | null>(null)
    const [activeEpisodeName, setActiveEpisodeName] = useState<string | null>(null)
    const [episodesList, setEpisodesList] = useState<playerListT[] | null>(null)

    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        // titleInfo.player.list[episodeNumber - 1].name
        console.log(router)
        if (!titleInfo && params.title && typeof params.title === 'string') {
            getAnilibriaTitle(params.title).then((resp) => {
                console.log(resp)
                setTitleInfo(resp)
            })
        }
    }, [params.title, router, titleInfo])

    useEffect(() => {
        if (titleInfo) {
            if (params.episodeNumber) {
                const episodeNumber = +params.episodeNumber
                if (episodeNumber) {
                    setEpisodeNumber(episodeNumber)
                    setActiveEpisodeName(titleInfo.player.list[episodeNumber].name)
                    setEpisodesList(
                        Object.keys(titleInfo.player.list).map(
                            (episodeKey: string) => titleInfo.player.list[+episodeKey],
                        ),
                    )
                }
            } else {
                router.push('/')
            }
        }
    }, [params, router, titleInfo])

    const findEpisodeIndex = (episodeNum: number) => {
        if (titleInfo) {
            const playerList = Object.keys(titleInfo.player.list).map((key) => titleInfo.player.list[key])
            return playerList.findIndex((item) => item.episode === episodeNum)
        } else {
            return 0
        }
    }

    const currentEpisodeIndex = () => {
        if (episodeNumber) {
            return findEpisodeIndex(episodeNumber)
        } else {
            return 0
        }
    }

    const handleEpisodeChange = (value: string | number) => {
        if (titleInfo) {
            router.push(`/anime/${titleInfo.code}/episodes/${value}`)
        }
    }

    if (titleInfo && episodeNumber && episodesList) {
        return (
            <>
                <Head>
                    <title>
                        Смотреть {titleInfo.names.ru} - {episodeNumber} серия
                    </title>
                </Head>
                <div className="container">
                    <div className={styles.episode_wrap}>
                        <div
                            className={clsx(
                                styles.episode_video_wrap,
                                titleInfo.type.string === 'MOVIE' && styles.full,
                            )}
                        >
                            <VideoPlayer
                                titleInfo={titleInfo}
                                activeEpisode={findEpisodeIndex(episodeNumber)}
                                playList={episodesList}
                            />
                            <div className={styles.episode_info}>
                                <div className={styles.left}>
                                    <h2>
                                        {activeEpisodeName
                                            ? `${episodeNumber} серия - ${activeEpisodeName}`
                                            : `${episodeNumber} серия`}
                                    </h2>
                                    <Link href={`/anime/${titleInfo.code}`}>{titleInfo.names.ru}</Link>
                                </div>
                                <div className={styles.right}>
                                    <Button
                                        color="primary"
                                        disabled={episodeNumber === episodesList[0].episode}
                                        onClick={() =>
                                            router.push(`/anime/${titleInfo.code}/episodes/${episodeNumber - 1}`)
                                        }
                                    >
                                        <MdSkipPrevious size={24} />
                                    </Button>
                                    <Button
                                        color="primary"
                                        disabled={episodeNumber === +episodesList[episodesList.length - 1].episode}
                                        onClick={() =>
                                            router.push(`/anime/${titleInfo.code}/episodes/${episodeNumber + 1}`)
                                        }
                                    >
                                        <MdSkipNext size={24} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.episode_list}>
                            {episodesList.map((item) => (
                                <Button
                                    className={episodeNumber === item.episode && styles.active_btn}
                                    key={item.uuid}
                                    onClick={() => router.push(`/anime/${titleInfo.code}/episodes/${item.episode}`)}
                                >
                                    {item.episode} эпизод
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Select
                        options={episodesList.map((item) => {
                            return {
                                key: item.episode,
                                label: `${item.episode} серия`,
                            }
                        })}
                        activeValue={episodeNumber}
                        onChange={handleEpisodeChange}
                        className={styles.episode_list_select}
                    ></Select>
                </div>
            </>
        )
    }

    // Return a loading or error message if titleInfo is not available
    return null
}
