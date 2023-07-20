import clsx from 'clsx'
import ContentLoader from 'react-content-loader'
import Cookie from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { addToLightGallery, StoreTypes } from '@/store/reducers/user.reducer'
import { addToUserFolder, getTitleByTitle, getUserLists, removeFromUserFolder } from '@/api'
import { Button } from '@/components/UI/Button'
import { Select } from '@/components/UI/Select'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { TitleCard, limitStr } from '@/components/TitleCard'
import { WatchItemInterface } from '../HomePage'
import { userInfo } from 'os'
import styles from './TitlePage.module.sass'

interface TitlePageProps {
    data: {
        data: WatchItemInterface[]
        meta: any
    }
}

export const TitlePage = () => {
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

    const dispatch = useDispatch()

    useEffect(() => {
        if (router.query.title) {
            getTitleByTitle(router.query.title).then((resp) => setTitleInfo(resp.data[0]))
        }
    }, [router.query.title])

    useEffect(() => {
        if (user && titleInfo) {
            getUserLists(user.id).then((resp) => {
                setUserLists(resp)

                const categories: any = {
                    watch_list: 'Смотрю',
                    planned_list: 'Запланировано',
                    viewed_list: 'Просмотрено',
                }
                let folder = null
                for (const category in categories) {
                    const item = resp[category].find((item: any) => item.id === titleInfo.id)
                    if (item) {
                        setUserList(categories[category])
                        folder = categories[category]
                        return
                    }
                }

                if (!folder) {
                    setUserList('Добавить в папку')
                }
            })
        }
    }, [router.asPath, titleInfo, user])

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    const handleFolderChange = (value: string) => {
        const token = Cookie.get('auth_token')
        if (token && titleInfo) {
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
                addToUserFolder(currentValue, titleInfo.id, user.id, token)
                    .then((resp) => setUserList(value))
                    .finally(() => setUserListLoading(false))
                return
            } else if (value === userList) {
                removeFromUserFolder(listToRemove, titleInfo.id, user.id, token)
                    .then((resp) => setUserList('Выберите папку'))
                    .finally(() => setUserListLoading(false))
            } else if (value === 'Смотрю') {
                removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
                    addToUserFolder('watch_list', titleInfo.id, user.id, token)
                        .then((resp) => setUserList(value))
                        .finally(() => setUserListLoading(false))
                })
            } else if (value === 'Запланировано') {
                removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
                    addToUserFolder('planned_list', titleInfo.id, user.id, token)
                        .then((resp) => setUserList(value))
                        .finally(() => setUserListLoading(false))
                })
            } else if (value === 'Просмотрено') {
                removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
                    addToUserFolder('viewed_list', titleInfo.id, user.id, token)
                        .then((resp) => setUserList(value))
                        .finally(() => setUserListLoading(false))
                })
            }
        } else {
            router.push('/auth/login')
        }
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
                                    onClick={() =>
                                        dispatch(
                                            addToLightGallery([
                                                titleInfo.attributes.poster?.data.attributes.url,
                                            ]),
                                        )
                                    }
                                />
                            )}

                            <Button
                                color="primary"
                                className={styles.button}
                                onClick={() => {
                                    if (titleInfo.attributes.episodes.length > 0) {
                                        router.push(
                                            `/watch/${titleInfo.attributes.title_id}/episodes/1`,
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
                                onChange={handleFolderChange}
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
                                    <span>{titleInfo.attributes.format}</span>
                                </li>
                                {titleInfo.attributes.format === 'ТВ Сериал' && (
                                    <li>
                                        <p>Кол-во эпизодов</p>
                                        <span>{titleInfo.attributes.episodes.length} эп.</span>
                                    </li>
                                )}
                                <li>
                                    <p>Дата выхода</p>
                                    <span>
                                        {format(
                                            parseISO(titleInfo.attributes.release_date),
                                            'd MMMM, yyyy',
                                            { locale: ru },
                                        )}
                                    </span>
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
                                onChange={handleFolderChange}
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
                                    <span>{titleInfo.attributes.format}</span>
                                </li>
                                {titleInfo.attributes.format === 'ТВ Сериал' && (
                                    <li>
                                        <p>Кол-во эпизодов</p>
                                        <span>{titleInfo.attributes.episodes.length} эп.</span>
                                    </li>
                                )}
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
                                {titleInfo.attributes.description.length < 350
                                    ? titleInfo.attributes.description
                                    : hideDesc
                                    ? limitStr(titleInfo.attributes.description, 350)
                                    : titleInfo.attributes.description}
                            </ReactMarkdown>
                            {titleInfo.attributes.description.length >= 350 && (
                                <button
                                    onClick={() => setHideDesc(!hideDesc)}
                                    className={styles.more_btn}
                                >
                                    {hideDesc ? 'Подробнее' : 'Скрыть'}
                                </button>
                            )}

                            <div className={styles.frames_wrap}>
                                <h3>Кадры</h3>
                                {titleInfo.attributes.frames.data &&
                                    titleInfo.attributes.frames.data.length > 0 && (
                                        <div className={styles.frames}>
                                            {titleInfo.attributes.frames.data.map((item) => (
                                                <Image
                                                    key={item.id}
                                                    src={item.attributes.url}
                                                    width={item.attributes.width}
                                                    height={item.attributes.height}
                                                    alt={item.attributes.name}
                                                />
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {titleInfo.attributes.type === 'Мультсериал' ||
                            titleInfo.attributes.type === 'Сериал' ||
                            titleInfo.attributes.type === 'Аниме' ? (
                                <div className={styles.episodes}>
                                    <h3>Список серий</h3>
                                    {episodes.length > 0 ? (
                                        episodes.map((item) => (
                                            <Button
                                                key={item.id}
                                                style={{ justifyContent: 'flex-start' }}
                                                onClick={() =>
                                                    router.push(
                                                        `/watch/${titleInfo.attributes.title_id}/episodes/${item.episode_number}`,
                                                    )
                                                }
                                            >
                                                {titleInfo.attributes.format === 'Фильм'
                                                    ? `${item.episode_name}`
                                                    : `${item.episode_number} эпизод`}
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
                            ) : (
                                <div className={styles.episodes}>
                                    <h3>Список озвучек </h3>
                                    {episodes.length > 0 ? (
                                        episodes.map((item) => (
                                            <Button
                                                key={item.id}
                                                style={{ justifyContent: 'flex-start' }}
                                                onClick={() =>
                                                    router.push(
                                                        `/watch/${titleInfo.attributes.title_id}/episodes/${item.episode_number}`,
                                                    )
                                                }
                                            >
                                                {`${item.episode_number}. ${item.episode_name}`}
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
                            )}

                            {titleInfo.attributes.relations.data.length > 0 && (
                                <div className={styles.relations}>
                                    <h4>Связанное</h4>
                                    <ul className={styles.relations_list}>
                                        {titleInfo.attributes.relations.data.length > 0 &&
                                            titleInfo.attributes.relations.data.map((item) => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={styles.relations_list_item}
                                                        onClick={() =>
                                                            router.push(
                                                                `/watch/${item.attributes.title_id}`,
                                                            )
                                                        }
                                                    >
                                                        <Image
                                                            src={
                                                                item.attributes.poster?.data
                                                                    .attributes.url ||
                                                                '/img/base-avatar.png'
                                                            }
                                                            width={
                                                                item.attributes.poster?.data
                                                                    .attributes.width
                                                            }
                                                            height={
                                                                item.attributes.poster?.data
                                                                    .attributes.height
                                                            }
                                                            alt="Hello"
                                                            className={styles.poster}
                                                        />
                                                        <div className={styles.item_info}>
                                                            <span>{item.attributes.status}</span>
                                                            <h4>{item.attributes.title}</h4>
                                                            <p>
                                                                {format(
                                                                    parseISO(
                                                                        item.attributes
                                                                            .release_date,
                                                                    ),
                                                                    'yyyy',
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </ul>
                                </div>
                            )}

                            <div className={styles.comments}>
                                <h2>Комментарии</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div className="container">
                <ContentLoader
                    speed={2}
                    width={'100%'}
                    height={'auto'}
                    viewBox="0 0 400 160"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <rect x="100" y="8" width="100%" height="6" />
                    <rect x="100" y="26" width="52" height="6" />
                    <rect x="100" y="56" width="410" height="6" />
                    <rect x="100" y="72" rx="3" ry="3" width="380" height="6" />
                    <rect x="100" y="88" rx="3" ry="3" width="178" height="6" />

                    <rect x="0" y="0" width="20%" height="100" />
                    <rect x="0" y="105" width="80" height="12" />
                    <rect x="0" y="122.5" width="80" height="12" />
                    <rect x="0" y="140" width="80" height="100" />
                </ContentLoader>
            </div>
        )
    }
}
