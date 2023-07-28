import clsx from 'clsx'
import ContentLoader from 'react-content-loader'
import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { addToLightGallery, StoreTypes } from '@/store/reducers/user.reducer'
import { getUserLists } from '@/api'
import { Button } from '@/components/UI/Button'
import { Select } from '@/components/UI/Select'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { limitStr } from '@/components/TitleCard'
import styles from './TitlePage.module.sass'
import { TitleT } from '../types/TitleT'

interface TitlePageProps {
    titleInfo: TitleT
}

export const TitlePage: React.FC<TitlePageProps> = ({ titleInfo }) => {
    const [hideDesc, setHideDesc] = useState<boolean>(true)
    const [mobile, setMobile] = useState<boolean>(false)
    const [showMore, setShowMore] = useState(false)
    const [userLists, setUserLists] = useState<any>(null)
    const [userList, setUserList] = useState<any | null>(null)
    const [userListLoading, setUserListLoading] = useState<boolean>(false)

    const router = useRouter()
    const user = useSelector((store: StoreTypes) => store.user)

    const dispatch = useDispatch()

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

    // const handleFolderChange = (value: string) => {
    //     const token = Cookie.get('auth_token')
    //     if (token && titleInfo) {
    //         const listToRemove =
    //             userList === 'Смотрю'
    //                 ? 'watch_list'
    //                 : userList === 'Запланировано'
    //                 ? 'planned_list'
    //                 : userList === 'Просмотрено'
    //                 ? 'viewed_list'
    //                 : null

    //         const currentValue =
    //             value === 'Смотрю'
    //                 ? 'watch_list'
    //                 : value === 'Запланировано'
    //                 ? 'planned_list'
    //                 : value === 'Просмотрено'
    //                 ? 'viewed_list'
    //                 : ''
    //         setUserListLoading(true)

    //         if (!listToRemove) {
    //             addToUserFolder(currentValue, titleInfo.id, user.id, token)
    //                 .then((resp) => setUserList(value))
    //                 .finally(() => setUserListLoading(false))
    //             return
    //         } else if (value === userList) {
    //             removeFromUserFolder(listToRemove, titleInfo.id, user.id, token)
    //                 .then((resp) => setUserList('Выберите папку'))
    //                 .finally(() => setUserListLoading(false))
    //         } else if (value === 'Смотрю') {
    //             removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
    //                 addToUserFolder('watch_list', titleInfo.id, user.id, token)
    //                     .then((resp) => setUserList(value))
    //                     .finally(() => setUserListLoading(false))
    //             })
    //         } else if (value === 'Запланировано') {
    //             removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
    //                 addToUserFolder('planned_list', titleInfo.id, user.id, token)
    //                     .then((resp) => setUserList(value))
    //                     .finally(() => setUserListLoading(false))
    //             })
    //         } else if (value === 'Просмотрено') {
    //             removeFromUserFolder(listToRemove, titleInfo.id, user.id, token).then((resp) => {
    //                 addToUserFolder('viewed_list', titleInfo.id, user.id, token)
    //                     .then((resp) => setUserList(value))
    //                     .finally(() => setUserListLoading(false))
    //             })
    //         }
    //     } else {
    //         router.push('/auth/login')
    //     }
    // }

    if (titleInfo) {
        const episodes = showMore ? titleInfo.player.list : titleInfo.player.list.slice(0, 7)
        const remainingCount = titleInfo.player.list.length - 7

        return (
            <>
                <Head>
                    <title>{`${titleInfo.names.ru} - смотреть на AniBam`}</title>
                </Head>
                <div className="container">
                    <div className={styles.title_info}>
                        <div className={styles.poster_wrap}>
                            {titleInfo.posters && (
                                <Image
                                    src={`https://anilibria.tv${titleInfo.posters.medium.url}`}
                                    width={200}
                                    height={500}
                                    alt={`Постер к аниме ${titleInfo.names.ru}`}
                                    className={styles.poster}
                                    onClick={() =>
                                        dispatch(
                                            addToLightGallery([
                                                `https://anilibria.tv${titleInfo.posters.original.url}`,
                                            ]),
                                        )
                                    }
                                />
                            )}

                            <Button
                                color="primary"
                                className={styles.button}
                                onClick={() => {
                                    if (titleInfo.player.list.length > 0) {
                                        router.push(`/watch/${titleInfo.code}/episodes/1`)
                                    } else enqueueSnackbar('Эпизоды отсутствуют')
                                }}
                            >
                                Смотреть онлайн
                            </Button>

                            {/* <Select
                                options={['Смотрю', 'Запланировано', 'Просмотрено']}
                                value={userList || 'Выберите папку'}
                                loading={userListLoading}
                                onChange={handleFolderChange}
                                className={styles.select}
                            ></Select> */}

                            <ul className={clsx(styles.anime_info, !mobile && styles.active)}>
                                {/* <li>
                                    <p>Возрастное ограничение</p>
                                    <span className={styles.age}>
                                        {`${titleInfo.}+` || 'Не указано'}
                                    </span>
                                </li> */}
                                {/* {titleInfo.attributes.studios.data.length > 0 && (
                                    <li>
                                        <p>Студия</p>
                                        <span>
                                            {titleInfo.attributes.studios.data.map((item) => {
                                                return (
                                                    <Link
                                                        key={item.id}
                                                        target="_blank"
                                                        href={`https://letmegooglethat.com/?q=${item.attributes.title} `}
                                                    >
                                                        {item.attributes.title}
                                                    </Link>
                                                )
                                            })}
                                        </span>
                                    </li>
                                )} */}
                                <li>
                                    <p>Формат</p>
                                    <span>{titleInfo.type.string}</span>
                                </li>
                                <li>
                                    <p>Кол-во эпизодов</p>
                                    <span>{titleInfo.player.episodes.last} эп.</span>
                                </li>
                                <li>
                                    <p>Статус</p>
                                    <span>{titleInfo.status.string}</span>
                                </li>
                                <li>
                                    <p>Страна</p>
                                    <span>Япония</span>
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
                            <h1>{titleInfo.names.ru}</h1>
                            <p className={clsx('caption', styles.caption)}>{titleInfo.names.en}</p>

                            <div className={styles.genres}>
                                {titleInfo.genres.map((item, index) => {
                                    return (
                                        <span key={index} className={styles.genre_item}>
                                            {item}
                                        </span>
                                    )
                                })}
                            </div>

                            <Button
                                className={styles.button}
                                onClick={() => {
                                    if (titleInfo.player.episodes.last > 0) {
                                        router.push(`/watch/${titleInfo.code}/episodes/1`)
                                    } else enqueueSnackbar('Эпизоды отсутствуют')
                                }}
                            >
                                Смотреть онлайн
                            </Button>
                            {/* <Select
                                options={['Смотрю', 'Запланировано', 'Просмотрено']}
                                value="Добавить в папку"
                                onChange={handleFolderChange}
                                className={styles.select}
                            ></Select> */}

                            <ul className={clsx(styles.anime_info, mobile && styles.active)}>
                                <li>
                                    <p>Тип</p>
                                    <span>{titleInfo.type.string}</span>
                                </li>

                                <li>
                                    <p>Кол-во эпизодов</p>
                                    <span>{titleInfo.player.episodes.last} эп.</span>
                                </li>
                                <li>
                                    <p>Статус</p>
                                    <span>{titleInfo.status.string}</span>
                                </li>
                                <li>
                                    <p>Страна</p>
                                    <span>Япония</span>
                                </li>
                            </ul>

                            <ReactMarkdown className={styles.description}>
                                {titleInfo.description.length < 350
                                    ? titleInfo.description
                                    : hideDesc
                                    ? limitStr(titleInfo.description, 350)
                                    : titleInfo.description}
                            </ReactMarkdown>

                            {titleInfo.description.length >= 350 && (
                                <button
                                    onClick={() => setHideDesc(!hideDesc)}
                                    className={styles.more_btn}
                                >
                                    {hideDesc ? 'Подробнее' : 'Скрыть'}
                                </button>
                            )}
                            {/*
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
                            </div> */}

                            <div className={styles.episodes}>
                                <h3>Список серий</h3>
                                {titleInfo.player.list.length > 0 ? (
                                    titleInfo.player.list.map((item, index) => (
                                        <Button
                                            key={index}
                                            style={{ justifyContent: 'flex-start' }}
                                            onClick={() =>
                                                router.push(
                                                    `/watch/${titleInfo.code}/episodes/${item.episode}`,
                                                )
                                            }
                                        >
                                            {`${item.episode} эпизод`}
                                        </Button>
                                    ))
                                ) : (
                                    <h2>В скором времени добавятся</h2>
                                )}

                                {episodes.length > 10 && (
                                    <Button onClick={toggleShowMore}>
                                        {showMore
                                            ? `Скрыть (${remainingCount})`
                                            : `Показать еще (${remainingCount})`}
                                    </Button>
                                )}
                            </div>

                            {titleInfo.franchises.length > 0 && (
                                <div className={styles.relations}>
                                    <h4>Порядок просмотра</h4>
                                    <ul className={styles.relations_list}>
                                        {titleInfo.franchises[0].releases.length > 0 &&
                                            titleInfo.franchises[0].releases.map((item: any) => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={styles.relations_list_item}
                                                        onClick={() =>
                                                            router.push(`/watch/${item.code}`)
                                                        }
                                                    >
                                                        <div className={styles.item_info}>
                                                            <h4>{item.names.ru}</h4>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </ul>
                                </div>
                            )}

                            <div className={styles.similar_titles}></div>

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
