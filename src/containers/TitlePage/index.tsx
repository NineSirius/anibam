import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { WatchItemInterface } from '../HomePage'
import styles from './TitlePage.module.sass'
import Image from 'next/image'
import { TitleCard, limitStr } from '@/components/TitleCard'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import clsx from 'clsx'
import { Button } from '@/components/UI/Button'
import { Select } from '@/components/UI/Select'
import { enqueueSnackbar } from 'notistack'

interface TitlePageProps {
    data: {
        data: WatchItemInterface[]
        meta: any
    }
}

export const TitlePage: React.FC<TitlePageProps> = ({ data }) => {
    const [titleInfo, setTitleInfo] = useState<WatchItemInterface>()
    const [hideDesc, setHideDesc] = useState<boolean>(true)
    const [mobile, setMobile] = useState<boolean>(false)
    const [showMore, setShowMore] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (data) {
            setTitleInfo(data.data[0])
        }
    }, [data])

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    if (titleInfo) {
        const episodes = showMore
            ? titleInfo.attributes.episodes
            : titleInfo.attributes.episodes.slice(0, 10)
        const remainingCount = titleInfo.attributes.episodes.length - 10

        return (
            <>
                <Head>
                    <title>{`${titleInfo.attributes.title} - смотреть на AniBam`}</title>
                </Head>
                <div className="container">
                    <div className={styles.title_info}>
                        <div className={styles.poster_wrap}>
                            {titleInfo.attributes.poster && (
                                <Image
                                    src={titleInfo.attributes.poster?.data.attributes.url}
                                    width={titleInfo.attributes.poster?.data.attributes.width}
                                    height={titleInfo.attributes.poster?.data.attributes.height}
                                    alt={titleInfo.attributes.poster?.data.attributes.name}
                                    className={styles.poster}
                                />
                            )}

                            <Button
                                className={styles.button}
                                onClick={() =>
                                    router.push(
                                        `/anime/${titleInfo.attributes.title_id}/episodes/1`,
                                    )
                                }
                            >
                                Смотреть онлайн
                            </Button>

                            <Select
                                options={['Просмотрено', 'Отложено', 'Брошено']}
                                value="Добавить в папку"
                                onChange={(value) => enqueueSnackbar('Папки в разработке')}
                                className={styles.select}
                            ></Select>

                            <ul className={clsx(styles.anime_info, !mobile && styles.active)}>
                                <li>
                                    <p>Возрастное ограничение</p>
                                    <span className={styles.age}>
                                        {`${titleInfo.attributes.age_limit}+` || 'Не указано'}
                                    </span>
                                </li>
                                <li>
                                    <p>Тип</p>
                                    <span>{titleInfo.attributes.type}</span>
                                </li>
                                <li>
                                    <p>Статус</p>
                                    <span>{titleInfo.attributes.status}</span>
                                </li>
                                <li>
                                    <p>Страна</p>
                                    <span>
                                        {titleInfo.attributes.countries.data.map((item) => {
                                            return item.attributes.title
                                        })}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className={styles.title_info_content}>
                            <h1>{titleInfo.attributes.title}</h1>
                            <p className={clsx('caption', styles.caption)}>
                                {titleInfo.attributes.original_title}
                            </p>

                            <div className={styles.genres}>
                                {titleInfo.attributes.genres.data.map((item) => {
                                    return (
                                        <span key={item.id} className={styles.genre_item}>
                                            {item.attributes.title}
                                        </span>
                                    )
                                })}
                            </div>

                            <Button
                                className={styles.button}
                                onClick={() =>
                                    router.push(
                                        `/anime/${titleInfo.attributes.title_id}/episodes/1`,
                                    )
                                }
                            >
                                Смотреть онлайн
                            </Button>
                            <Select
                                options={['Просмотрено', 'Отложено', 'Брошено']}
                                value="Добавить в папку"
                                onChange={(value) => enqueueSnackbar('Папки в разработке')}
                                className={styles.select}
                            ></Select>

                            <ul className={clsx(styles.anime_info, mobile && styles.active)}>
                                <li>
                                    <p>Возрастное ограничение</p>
                                    <span className={styles.age}>
                                        {`${titleInfo.attributes.age_limit}+` || 'Не указано'}
                                    </span>
                                </li>
                                <li>
                                    <p>Тип</p>
                                    <span>{titleInfo.attributes.type}</span>
                                </li>
                                <li>
                                    <p>Статус</p>
                                    <span>{titleInfo.attributes.status}</span>
                                </li>
                                <li>
                                    <p>Страна</p>
                                    <span>
                                        {titleInfo.attributes.countries.data.map((item) => {
                                            return item.attributes.title
                                        })}
                                    </span>
                                </li>
                            </ul>

                            <ReactMarkdown className={styles.description}>
                                {hideDesc
                                    ? limitStr(titleInfo.attributes.description, 350)
                                    : titleInfo.attributes.description}
                            </ReactMarkdown>
                            <button
                                onClick={() => setHideDesc(!hideDesc)}
                                className={styles.more_btn}
                            >
                                {hideDesc ? 'Подробнее' : 'Скрыть'}
                            </button>

                            <div className={styles.episodes}>
                                <h3>Список серий</h3>
                                {episodes.length > 0 ? (
                                    episodes.map((item) => (
                                        <Button
                                            key={item.id}
                                            style={{ justifyContent: 'flex-start' }}
                                            onClick={() =>
                                                router.push(
                                                    `/anime/${titleInfo.attributes.title_id}/episodes/${item.episode_number}`,
                                                )
                                            }
                                        >
                                            {item.episode_number} эпизод
                                        </Button>
                                    ))
                                ) : (
                                    <h2>В скором времени добавятся</h2>
                                )}

                                {titleInfo.attributes.episodes.length > 10 && (
                                    <Button onClick={toggleShowMore}>
                                        {showMore
                                            ? `Скрыть (${remainingCount})`
                                            : `Показать еще (${remainingCount})`}
                                    </Button>
                                )}
                            </div>

                            <div className={styles.relations}>
                                <h4>Связанное</h4>
                                <ul className={styles.relations_list}>
                                    {titleInfo.attributes.relations.data.length > 0 &&
                                        titleInfo.attributes.relations.data.map((item) => {
                                            return (
                                                <TitleCard
                                                    key={item.id}
                                                    title={item.attributes.title}
                                                    titleId={item.attributes.title_id}
                                                    description={item.attributes.description}
                                                    poster={item.attributes.poster?.data.attributes}
                                                />
                                            )
                                        })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
