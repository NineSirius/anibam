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
import { MdStar } from 'react-icons/md'
import { addToUserFolder, getTitleRating, getUserLists, removeFromUserFolder } from '@/api'
import { useSelector } from 'react-redux'
import { StoreTypes } from '@/store/reducers/user.reducer'
import Cookie from 'js-cookie'

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
    const [rate, setRate] = useState<string | null>(null)
    const [userLists, setUserLists] = useState<any>(null)
    const [userList, setUserList] = useState<any | null>(null)
    const [userListLoading, setUserListLoading] = useState<boolean>(false)

    const router = useRouter()
    const user = useSelector((store: StoreTypes) => store.user)

    useEffect(() => {
        if (data) {
            setTitleInfo(data.data[0])
            // getTitleRating(data.data[0].attributes.title_id).then((resp) => {
            //     console.log(resp)

            //     if (resp.data.data[0].attributes.rating.length > 0) {
            //         console.log(resp.data.data[0].attributes.rating)
            //     }
            // })
        }
    }, [data])

    useEffect(() => {
        if (user && data) {
            getUserLists(user.id).then((resp) => {
                setUserLists(resp)

                const categories: any = {
                    watch_list: 'Смотрю',
                    planned_list: 'Запланировано',
                    viewed_list: 'Просмотрено',
                }

                for (const category in categories) {
                    const item = resp[category].find((item: any) => item.id === data.data[0].id)
                    if (item) {
                        setUserList(categories[category])
                        return
                    }
                }
            })
        }
    }, [data, user])

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    if (titleInfo) {
        const episodes = showMore
            ? titleInfo.attributes.episodes
            : titleInfo.attributes.episodes.slice(0, 7)
        const remainingCount = titleInfo.attributes.episodes.length - 7

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
                                onClick={() => {
                                    if (titleInfo.attributes.episodes.length > 0) {
                                        router.push(
                                            `/anime/${titleInfo.attributes.title_id}/episodes/1`,
                                        )
                                    } else enqueueSnackbar('Эпизоды отсутствуют')
                                }}
                            >
                                Смотреть онлайн
                            </Button>

                            <Select
                                options={['Смотрю', 'Запланировано', 'Просмотрено']}
                                value={userList || 'Выберите папку'}
                                loading={userListLoading}
                                onChange={(value) => {
                                    const token = Cookie.get('auth_token')
                                    if (token) {
                                        const listToRemove =
                                            userList === 'Смотрю'
                                                ? 'watch_list'
                                                : userList === 'Запланировано'
                                                ? 'planned_list'
                                                : userList === 'Просмотрено'
                                                ? 'viewed_list'
                                                : null

                                        const currentValue =
                                            value === 'Смотрю'
                                                ? 'watch_list'
                                                : value === 'Запланировано'
                                                ? 'planned_list'
                                                : value === 'Просмотрено'
                                                ? 'viewed_list'
                                                : ''
                                        setUserListLoading(true)

                                        if (!listToRemove) {
                                            addToUserFolder(
                                                currentValue,
                                                titleInfo.id,
                                                user.id,
                                                token,
                                            )
                                                .then((resp) => setUserList(value))
                                                .finally(() => setUserListLoading(false))
                                            return
                                        } else if (value === userList) {
                                            removeFromUserFolder(
                                                listToRemove,
                                                titleInfo.id,
                                                user.id,
                                                token,
                                            )
                                                .then((resp) => setUserList('Выберите папку'))
                                                .finally(() => setUserListLoading(false))
                                        } else if (value === 'Смотрю') {
                                            removeFromUserFolder(
                                                listToRemove,
                                                titleInfo.id,
                                                user.id,
                                                token,
                                            ).then((resp) => {
                                                addToUserFolder(
                                                    'watch_list',
                                                    titleInfo.id,
                                                    user.id,
                                                    token,
                                                )
                                                    .then((resp) => setUserList(value))
                                                    .finally(() => setUserListLoading(false))
                                            })
                                        } else if (value === 'Запланировано') {
                                            removeFromUserFolder(
                                                listToRemove,
                                                titleInfo.id,
                                                user.id,
                                                token,
                                            ).then((resp) => {
                                                addToUserFolder(
                                                    'planned_list',
                                                    titleInfo.id,
                                                    user.id,
                                                    token,
                                                )
                                                    .then((resp) => setUserList(value))
                                                    .finally(() => setUserListLoading(false))
                                            })
                                        } else if (value === 'Просмотрено') {
                                            removeFromUserFolder(
                                                listToRemove,
                                                titleInfo.id,
                                                user.id,
                                                token,
                                            ).then((resp) => {
                                                addToUserFolder(
                                                    'viewed_list',
                                                    titleInfo.id,
                                                    user.id,
                                                    token,
                                                )
                                                    .then((resp) => setUserList(value))
                                                    .finally(() => setUserListLoading(false))
                                            })
                                        }
                                    }
                                }}
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
                            <div className={styles.rating}>
                                {/* <span>
                                    <MdStar size={28} />
                                    {(titleInfo.attributes.rating / titleInfo.attributes.rating) *
                                        10 || '0'}
                                </span> */}
                                {/* <Select
                                    options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                    value={rate ? rate : 'Оцените сериал'}
                                    onChange={(value) => {
                                        setRate(value)
                                    }}
                                ></Select> */}
                            </div>
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
                                onClick={() => {
                                    if (titleInfo.attributes.episodes.length > 0) {
                                        router.push(
                                            `/anime/${titleInfo.attributes.title_id}/episodes/1`,
                                        )
                                    } else enqueueSnackbar('Эпизоды отсутствуют')
                                }}
                            >
                                Смотреть онлайн
                            </Button>
                            <Select
                                options={['Смотрю', 'Запланировано', 'Просмотрено']}
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

                            {titleInfo.attributes.relations.data.length > 0 && (
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
                                                        poster={
                                                            item.attributes.poster?.data.attributes
                                                        }
                                                    />
                                                )
                                            })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
