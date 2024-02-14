import clsx from 'clsx'
import ContentLoader from 'react-content-loader'
import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { addToLightGallery, StoreTypes } from '@/store/reducers/user.reducer'
import { Button } from '@/components/UI/Button'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { TitleCard, limitStr } from '@/components/TitleCard'
import styles from './TitlePage.module.sass'
import { TitleT, playerListT } from '../types/TitleT'
import { MdShare } from 'react-icons/md'
import { Modal } from '@/components/UI/Modal'
import Link from 'next/link'
import { ScheduleT } from '../types/ScheduleT'
import { getAnilibriaSchedule, getAnilibriaTitle } from '@/api'
import { shareSocial } from './shareSocial'
import { Metadata } from 'next'
import VideoPlayer from '@/components/VideoPlayer'
import axios from 'axios'

export const metadata: Metadata = {
    title: 'AniBam - лучший сайт для просмотра аниме',
    description: 'Welcome to Next.js',
}

type PlayerT = {
    name: string
    url: string | null
}

export const TitlePage = () => {
    const [titleInfo, setTitleInfo] = useState<TitleT | null>(null)
    const [episodesList, setEpisodesList] = useState<playerListT[]>([])
    const [schedule, setSchedule] = useState<ScheduleT[] | null>(null)
    const [franchises, setFranchises] = useState<any[]>([])

    const [hideDesc, setHideDesc] = useState<boolean>(true)
    const [mobile, setMobile] = useState<boolean>(false)
    const [showMore, setShowMore] = useState(false)
    const [userLists, setUserLists] = useState<any>(null)
    const [userList, setUserList] = useState<any | null>(null)
    const [userListLoading, setUserListLoading] = useState<boolean>(false)
    const [shareModalShow, setShareModalShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [announce, setAnnounce] = useState<string | null>('')
    const [players, setPlayers] = useState<PlayerT[]>([])
    const [activePlayer, setActivePlayer] = useState<PlayerT>({
        name: 'AniBam',
        url: null,
    })

    const router = useRouter()
    const params = useParams()
    const user = useSelector((store: StoreTypes) => store.user)

    const dispatch = useDispatch()

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    useEffect(() => {
        if (params.title) {
            //@ts-ignore
            getAnilibriaTitle(params.title)
                .then((resp) => {
                    const data = {
                        ...resp,
                        player: {
                            ...resp.player,
                            list: Object.keys(resp.player.list).map((key: string) => resp.player.list[key]),
                        },
                    }

                    setEpisodesList(
                        Object.keys(data.player.list).map((episodeKey: string) => data.player.list[+episodeKey]),
                    )
                    const players = [
                        {
                            name: 'AniBam',
                            url: null,
                        },
                        {
                            name: 'AniLibria',
                            url: `https://www.anilibria.tv/public/iframe.php?id=${data.id}`,
                        },
                    ]
                    if (data.player.alternative_player) {
                        players.push({ name: 'Внешний плеер', url: data.player.alternative_player })
                    }

                    setPlayers(players)
                    setTitleInfo(data)
                })
                .catch((err) => {
                    const error = err.response.data.error
                    switch (error.code) {
                        case 404:
                            redirect('/404')
                            break

                        default:
                            break
                    }
                })
            getAnilibriaSchedule().then((resp) => setSchedule(resp.data))
        }
    }, [params])

    useEffect(() => {
        if (titleInfo && schedule && titleInfo.status.string === 'В работе') {
            schedule.forEach((item) => {
                let day: string | null = null
                switch (item.day) {
                    case 0:
                        day = 'Новая серия каждый понедельник'
                        break
                    case 1:
                        day = 'Новая серия каждый вторник'
                        break
                    case 2:
                        day = 'Новая серия каждую среду'
                        break
                    case 3:
                        day = 'Новая серия каждый четверг'
                        break
                    case 4:
                        day = 'Новая серия каждую пятницу'
                        break
                    case 5:
                        day = 'Новая серия каждую субботу'
                        break
                    case 6:
                        day = 'Новая серия каждое воскресенье'
                        break
                    default:
                        break
                }
                if (day) {
                    item.list.forEach((list) => {
                        if (list.code === titleInfo.code) {
                            setAnnounce(day)
                        }
                    })
                }
            })
        } else {
            setAnnounce('')
        }
    }, [schedule, titleInfo])

    const handleCopyClick = () => {
        const copyText = document.location.href
        navigator.clipboard
            .writeText(copyText)
            .then(() => enqueueSnackbar('Ссылка скопирована', { variant: 'success' }))
            .catch(() => enqueueSnackbar('Не удалось скопировать ссылку', { variant: 'error' }))
    }

    if (titleInfo && typeof document !== 'undefined') {
        const episodes = showMore ? titleInfo.player.list : titleInfo.player.list.slice(0, 7)
        const remainingCount = titleInfo.player.list.length - 7

        return (
            <>
                {/* <Head>
                    <title>{`${titleInfo.names.ru} - смотреть на AniBam`}</title>
                    <meta property="title" content={`${titleInfo.names.ru} - смотреть на AniBam`} />
                    <meta property="description" content={`${titleInfo.description}`} />
                    <meta property="image" content={`${titleInfo.posters.medium.url}`} />
                    <meta property="url" content={`https://anibam.vercel.app/anime/${titleInfo.code}`} />
                    <meta property="og:title" content={`${titleInfo.names.ru} - смотреть на AniBam`} />
                    <meta property="og:description" content={`${titleInfo.description}`} />
                    <meta property="og:image" content={`${titleInfo.posters.medium.url}`} />
                    <meta property="og:url" content={`https://anibam.vercel.app/anime/${titleInfo.code}`} />
                </Head> */}

                <div className={styles.content}>
                    <div className={`${styles.title_info} container`}>
                        <div className={styles.left}>
                            <Image
                                src={`https://anilibria.tv${titleInfo.posters.medium.url}`}
                                width={300}
                                height={200}
                                alt={`Постер к аниме ${titleInfo.names.ru}`}
                                className={styles.poster}
                            />

                            <Button color="primary">Смотреть онлайн</Button>
                        </div>

                        <div className={styles.right}>
                            <h1 className={styles.title}>{titleInfo.names.ru}</h1>
                            <p className={styles.caption}>{titleInfo.names.en}</p>

                            <div className={styles.title_controls}>
                                <Button color="primary" onClick={() => setShareModalShow(true)}>
                                    <MdShare />
                                    Поделиться
                                </Button>
                            </div>

                            <ul className={styles.info_list}>
                                <li className={styles.info_list_item}>
                                    <span className={styles.title}>Тип</span>
                                    <span className={styles.value}>{titleInfo.type.full_string}</span>
                                </li>
                                <li className={styles.info_list_item}>
                                    <span className={styles.title}>Статус</span>
                                    <span className={styles.value}>{titleInfo.status.string}</span>
                                </li>
                                <li className={styles.info_list_item}>
                                    <span className={styles.title}>Жанры</span>
                                    <span className={styles.value}>
                                        {titleInfo.genres.map((genre, index) => (
                                            <a
                                                key={genre}
                                                className={styles.link}
                                                href={`https://anibam.vercel.app/anime?genre=${genre}`}
                                            >
                                                {`${genre}${index !== titleInfo.genres.length - 1 ? ',' : ''} `}
                                            </a>
                                        ))}
                                    </span>
                                </li>
                                <li className={styles.info_list_item}>
                                    <span className={styles.title}>Сезон</span>
                                    <span className={styles.value}>
                                        {titleInfo.season.string} {titleInfo.season.year}
                                    </span>
                                </li>
                            </ul>

                            <ReactMarkdown className={styles.description}>{titleInfo.description}</ReactMarkdown>

                            {titleInfo.franchises.map((franchise: any) => (
                                <div className={styles.franchise} key={franchise.franchise.id}>
                                    <h4>Франшиза {`"${franchise.franchise.name}"`}</h4>

                                    <div className={styles.franchise_titles}>
                                        {/* {franchise.releases.map((release: any) => {
                                            const data = await fetch(
                                                'https://api.anilibria.tv/v3/title?code=tokyo-ghoul&filter=id,names,code,posters,',
                                            )
                                            // <TitleCard key={release.code} />
                                        })} */}
                                    </div>
                                </div>
                            ))}

                            <div className={styles.player}>
                                <h4>Смотреть онлайн</h4>
                                <div className={styles.player_list}>
                                    {players.map((player) => (
                                        <button
                                            key={player.name}
                                            onClick={() => setActivePlayer(player)}
                                            className={styles.button}
                                        >
                                            {player.name}
                                        </button>
                                    ))}
                                </div>
                                {activePlayer.name === 'AniBam' ? (
                                    <VideoPlayer
                                        titleInfo={titleInfo}
                                        activeEpisode={1}
                                        playList={episodesList}
                                        className={styles.player_anibam}
                                    />
                                ) : (
                                    <iframe
                                        src={activePlayer.url}
                                        type="text/html"
                                        width={'100%'}
                                        height={515}
                                        frameborder="0"
                                        allowfullscreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={shareModalShow} onClose={() => setShareModalShow(false)}>
                    <div className={styles.share_modal}>
                        <h2>Поделиться аниме</h2>
                        <p>Нажмите на ссылку чтобы скопировать</p>
                        <pre>
                            <code onClick={handleCopyClick}>{`https://anibam.vercel.app/anime/${titleInfo.code}`}</code>
                        </pre>
                        <p>Поделиться в</p>
                        <div className={styles.social}>
                            {shareSocial.map((item) => {
                                return (
                                    <Link
                                        key={item.id}
                                        className={styles.share_btn}
                                        href={`${item.url}https://anibam.vercel.app/anime/${titleInfo.code}`}
                                        target="_blank"
                                    >
                                        <Image
                                            src={item.imageUrl}
                                            width={100}
                                            height={100}
                                            alt={`Поделиться в ${item.title}`}
                                        />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </Modal>
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
