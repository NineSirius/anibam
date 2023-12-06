import { getAnilibriaTitle, getTitleByTitle } from '@/api'
import React from 'react'
import styles from './EpisodePage.module.sass'
import { useEffect, useState } from 'react'
import { Button } from '@/components/UI/Button'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Select } from '@/components/UI/Select'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import clsx from 'clsx'
import { TitleT, hlsT } from '../types/TitleT'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'

interface EpisodePageProps {
    titleInfo: TitleT
    episodeNumber: number
}

export const EpisodePage: React.FC<EpisodePageProps> = ({ titleInfo, episodeNumber }) => {
    const [activeEpisode, setActiveEpisode] = useState<number | string>(episodeNumber)
    const [activeEpisodeName, setActiveEpisodeName] = useState<string | null>(
        titleInfo.player.list[episodeNumber - 1].name,
    )

    const router = useRouter()

    useEffect(() => {
        if (episodeNumber !== activeEpisode) {
            setActiveEpisode(episodeNumber)
            setActiveEpisodeName(titleInfo.player.list[episodeNumber - 1].name)
        }
    }, [activeEpisode, episodeNumber, titleInfo.player.list])

    const findEpisodeIndex = (episodeNum: number) => {
        return titleInfo.player.list.findIndex((item) => item.episode === episodeNum)
    }

    const currentEpisodeIndex = findEpisodeIndex(episodeNumber)

    const handleEpisodeChange = (value: string | number) => {
        if (titleInfo) {
            setActiveEpisode(value)
            router.push(`/anime/${titleInfo.code}/episodes/${value}`)
        }
    }

    if (titleInfo) {
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
                                url={`https://cache.libria.fun${titleInfo.player.list[currentEpisodeIndex].hls.hd}`}
                                preview={titleInfo.player.list[currentEpisodeIndex].preview}
                                skips={titleInfo.player.list[currentEpisodeIndex].skips}
                                qualityOptions={Object.keys(titleInfo.player.list[currentEpisodeIndex].hls)
                                    .map((key) => {
                                        const hlsUrl =
                                            //@ts-ignore
                                            titleInfo.player.list[currentEpisodeIndex].hls[key]
                                        if (hlsUrl) {
                                            return {
                                                quality: key,
                                                url: `https://cache.libria.fun/${hlsUrl}`,
                                            }
                                        }
                                        return null
                                    })
                                    .filter(Boolean)}
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
                                        disabled={episodeNumber === +titleInfo.player.list[0].episode}
                                        onClick={() =>
                                            router.push(`/anime/${titleInfo.code}/episodes/${currentEpisodeIndex}`)
                                        }
                                    >
                                        <MdSkipPrevious size={24} />
                                    </Button>
                                    <Button
                                        color="primary"
                                        disabled={
                                            episodeNumber ===
                                            +titleInfo.player.list[titleInfo.player.list.length - 1].episode
                                        }
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
                            {titleInfo.player.list.map((item) => (
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
                        options={titleInfo.player.list.map((item) => {
                            return {
                                key: item.episode,
                                label: item.name ? `${item.episode} серия - ${item.name}` : `${item.episode} серия`,
                            }
                        })}
                        activeValue={activeEpisode}
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
