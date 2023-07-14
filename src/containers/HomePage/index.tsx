import React, { useEffect } from 'react'
import Head from 'next/head'
import { getTitles } from '@/api'
import { TitleCard } from '@/components/TitleCard'

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
        type: 'ТВ Сериал' | 'Фильм' | 'OVA' | 'Спешл'
        release_date: string
        age_limit: number
        poster: {
            data: {
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
        } | null
        genres: {
            data: WatchItemGenre[]
        }
        countries: {
            data: WatchItemCountry[]
        }
        episodes: WatchItemEpisode[]
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

interface HomePageProps {
    data: {
        data: WatchItemInterface[]
        meta: any
    }
}

export const HomePage: React.FC<HomePageProps> = ({ data }) => {
    const [titles, setTitles] = React.useState<WatchItemInterface[]>([])

    useEffect(() => {
        console.log(data)

        if (data) {
            setTitles(data.data)
        }
    }, [data])

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
                            />
                        )
                    })}
                </div>
            </div>
        </>
    )
}
