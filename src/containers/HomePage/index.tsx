import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { getTitleWithCustomFields, getTitles } from '@/api'
import { TitleCard } from '@/components/TitleCard'
import styles from './HomePage.module.sass'
import { useRouter } from 'next/router'
import { Button } from '@/components/UI/Button'

export interface WatchItemInterface {
    id: number
    attributes: {
        title: string
        original_title: string
        slogan: string | null
        createdAt: string
        updatedAt: string
        publishedAt: string
        title_id: string
        description: string
        status: 'Вышел' | 'Онгоинг' | 'Анонс'
        format: 'ТВ Сериал' | 'Фильм' | 'OVA' | 'Спешл'
        type: 'Аниме' | 'Фильм' | 'Сериал' | 'Мультфильм' | 'Мультсериал'
        release_date: string
        age_limit: number
        poster: {
            data: WatchItemImage
        } | null
        genres: {
            data: WatchItemGenre[]
        }
        countries: {
            data: WatchItemCountry[]
        }
        episodes: WatchItemEpisode[]
        relations: {
            data: WatchItemInterface[]
        }
        frames: {
            data?: WatchItemImage[]
        }
    }
}

interface WatchItemCountry {
    id: number
    attributes: {
        title: string
        createdAt: string
        updatedAt: string
        publishedAt: string
        titles: {
            data: WatchItemInterface[]
        }
    }
}

interface WatchItemImage {
    id: number
    attributes: {
        name: string
        alternativeText: string | null
        caption: string | null
        width: number
        height: number
        url: string
        formats: {
            thumbnail?: {
                name: string
                hash: string
                ext: '.jpg' | '.png'
                mime: 'image/jpeg' | 'image/png'
                path: string | null
                width: number
                height: number
                size: number
                url: string
                provider_metadata?: {
                    public_id: string
                    resource_type: 'image'
                }
            }
            small?: {
                name: string
                hash: string
                ext: '.jpg' | '.png'
                mime: 'image/jpeg' | 'image/png'
                path: string | null
                width: number
                height: number
                size: number
                url: string
                provider_metadata?: {
                    public_id: string
                    resource_type: 'image'
                }
            }
        }
    }
}

interface WatchItemGenre {
    id: number
    attributes: {
        title: string
        genre_id: string
        createdAt: string
        updatedAt: string
        publishedAt: string
        titles: {
            data: WatchItemInterface[]
        }
    }
}

interface WatchItemEpisode {
    id: number
    episode_name: string
    episode_number: number
    episode_url: string
}

export const HomePage = () => {
    const [titles, setTitles] = React.useState<WatchItemInterface[]>([])
    const [innerWidth, setInnerWidth] = useState<number>(0)

    useEffect(() => {
        getTitleWithCustomFields(['title', 'title_id', 'poster', 'description', 'type']).then(
            (resp) => setTitles(resp.data),
        )
        setInnerWidth(window.innerWidth)
    }, [])

    const router = useRouter()

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
                <div className={styles.banners}>
                    <div
                        className={styles.banner}
                        onClick={() => router.replace('https://t.me/anibam_bot')}
                    >
                        <h4>Telegram Бот</h4>
                        <p>Смотрите аниме в нашем телеграмм боте</p>
                    </div>
                    <div className={styles.banner}>
                        <h4>Мобильное приложение</h4>
                        <p>Вы также можете смотреть аниме в нашем мобильном приложении</p>
                    </div>
                </div>

                <h4 className="main_title">Подборка</h4>

                <div className="anime_list">
                    {titles.map((item) => {
                        return (
                            <TitleCard
                                key={item.id}
                                poster={item.attributes.poster?.data.attributes}
                                title={item.attributes.title}
                                titleId={item.attributes.title_id}
                                description={item.attributes.description}
                                type={item.attributes.type}
                                episodesCount={item.attributes.episodes.length}
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
