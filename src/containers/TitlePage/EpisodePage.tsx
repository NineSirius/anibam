import { getTitleByTitle } from '@/api'
import React from 'react'
import styles from './EpisodePage.module.sass'
import { useEffect, useState } from 'react'
import { WatchItemInterface } from '../HomePage'
import { Button } from '@/components/UI/Button'
import { useRouter } from 'next/router'

interface EpisodeProps {
    data: WatchItemInterface
    episodeNumber: any
}

export const EpisodePage: React.FC<EpisodeProps> = ({ data, episodeNumber }) => {
    const [animeInfo, setAnimeInfo] = useState<WatchItemInterface | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (data) {
            setAnimeInfo(data)
        }
    }, [data])

    if (animeInfo) {
        return (
            <div className="container">
                <div className={styles.episode_wrap}>
                    <iframe
                        src={animeInfo.attributes.episodes[episodeNumber - 1].episode_url}
                        width="70%"
                        height="400"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay *; fullscreen *"
                    ></iframe>

                    <div className={styles.episode_list}>
                        {animeInfo.attributes.episodes.map((item) => {
                            return (
                                <Button
                                    className={
                                        episodeNumber === item.episode_number && styles.active_btn
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
            </div>
        )
    }
}
