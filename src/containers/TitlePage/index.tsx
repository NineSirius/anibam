import clsx from 'clsx'
import ContentLoader from 'react-content-loader'
import { enqueueSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { addToLightGallery, StoreTypes } from '@/store/reducers/user.reducer'
import { Button } from '@/components/UI/Button'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { limitStr } from '@/components/TitleCard'
import styles from './TitlePage.module.sass'
import { TitleT } from '../types/TitleT'
import { MdShare } from 'react-icons/md'
import { Modal } from '@/components/UI/Modal'
import Link from 'next/link'
import { ScheduleT } from '../types/ScheduleT'

interface TitlePageProps {
    titleInfo: TitleT
    schedule: ScheduleT[]
}

export const TitlePage: React.FC<TitlePageProps> = ({ titleInfo, schedule }) => {
    const [hideDesc, setHideDesc] = useState<boolean>(true)
    const [mobile, setMobile] = useState<boolean>(false)
    const [showMore, setShowMore] = useState(false)
    const [userLists, setUserLists] = useState<any>(null)
    const [userList, setUserList] = useState<any | null>(null)
    const [userListLoading, setUserListLoading] = useState<boolean>(false)
    const [shareModalShow, setShareModalShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [announce, setAnnounce] = useState<string>('')

    const shareSocial = [
        {
            id: 1,
            title: 'Вконтакте',
            url: `https://vk.com/share.php?url=`,
            imageUrl: '/img/logo/vk-logo.png',
        },
        {
            id: 2,
            title: 'Телеграмм',
            url: `https://t.me/share/url?url=`,
            imageUrl: '/img/logo/telegram-logo.png',
        },
    ]

    const router = useRouter()
    const user = useSelector((store: StoreTypes) => store.user)

    const dispatch = useDispatch()

    const toggleShowMore = () => {
        setShowMore(!showMore)
    }

    useEffect(() => {
        if (titleInfo.status.string === 'В работе') {
            schedule.forEach((item) => {
                let day: string | null = null
                switch (item.day) {
                    case 0:
                        day = 'понедельник'
                        break
                    case 1:
                        day = 'вторник'
                        break
                    case 2:
                        day = 'среду'
                        break
                    case 3:
                        day = 'четверг'
                        break
                    case 4:
                        day = 'пятницу'
                        break
                    case 5:
                        day = 'субботу'
                        break
                    case 6:
                        day = 'воскресенье'
                        break
                    default:
                        break
                }
                if (day) {
                    item.list.forEach((list) => {
                        if (list.code === titleInfo.code) {
                            setAnnounce(`Новая серия каждый ${day}`)
                        }
                    })
                }
            })
        } else {
            setAnnounce('')
        }
    }, [schedule, titleInfo.code, titleInfo.status.string])

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
                <Head>
                    <title>{`${titleInfo.names.ru} - смотреть на AniBam`}</title>
                    <meta property="og:title" content={`${titleInfo.names.ru} смотреть онлайн`} />
                    <meta property="og:description" content={`${titleInfo.description}`} />
                    <meta property="og:image" content={`${titleInfo.posters.medium.url}`} />
                    <meta property="og:url" content={`https://anibam.vercel.app/anime/${titleInfo.code}`} />
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
                                        router.push(`/anime/${titleInfo.code}/episodes/1`)
                                    } else enqueueSnackbar('Эпизоды отсутствуют')
                                }}
                            >
                                Смотреть онлайн
                            </Button>

                            <ul className={clsx(styles.anime_info, !mobile && styles.active)}>
                                <li>
                                    <p>Формат</p>
                                    <span>{titleInfo.type.string}</span>
                                </li>
                                <li>
                                    <p>Дата выхода</p>
                                    <span>{`${titleInfo.season.year}`}</span>
                                </li>
                                <li>
                                    <p>Озвучка</p>
                                    <span title={titleInfo.team.voice.join(', ')}>AniLibria</span>
                                </li>

                                <li>
                                    <p>Кол-во эпизодов</p>
                                    <span>{titleInfo.player.list.length} эп.</span>
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
                            <div className={styles.rating}></div>
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

                            <div className={styles.mobile_play_btn_wrap}>
                                <Button
                                    className={styles.button}
                                    onClick={() => {
                                        if (titleInfo.player.episodes.last > 0) {
                                            router.push(`/anime/${titleInfo.code}/episodes/1`)
                                        } else enqueueSnackbar('Эпизоды отсутствуют')
                                    }}
                                >
                                    Смотреть онлайн
                                </Button>
                                <Button
                                    className={styles.share_btn}
                                    color="primary"
                                    onClick={() => setShareModalShow(true)}
                                >
                                    <MdShare size={20} />
                                </Button>
                            </div>
                            {/* <Select
                                options={['Смотрю', 'Запланировано', 'Просмотрено']}
                                value="Добавить в папку"
                                onChange={handleFolderChange}
                                className={styles.select}
                            ></Select> */}

                            <ul className={clsx(styles.anime_info, mobile && styles.active)}>
                                <li>
                                    <p>Формат</p>
                                    <span>{titleInfo.type.string}</span>
                                </li>
                                <li>
                                    <p>Дата выхода</p>
                                    <span>{`${titleInfo.season.year}, ${titleInfo.season.string}`}</span>
                                </li>
                                <li>
                                    <p>Озвучка</p>
                                    <span title={titleInfo.team.voice.join(', ')}>AniLibria</span>
                                </li>
                                <li>
                                    <p>Кол-во эпизодов</p>
                                    <span>{titleInfo.player.list.length} эп.</span>
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

                            <ReactMarkdown className={clsx(styles.description, !hideDesc && styles.active)}>
                                {titleInfo.description.length < 350
                                    ? titleInfo.description
                                    : hideDesc
                                    ? limitStr(titleInfo.description, 350)
                                    : titleInfo.description}
                            </ReactMarkdown>

                            {titleInfo.description.length >= 350 && (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button onClick={() => setHideDesc(!hideDesc)} className={styles.more_btn}>
                                        {hideDesc ? 'Подробнее' : 'Скрыть'}
                                    </button>
                                </div>
                            )}

                            <div className={styles.episodes}>
                                <h3>Список серий</h3>
                                <p className={styles.announce}>{announce}</p>
                                {episodes.length > 0 ? (
                                    episodes.map((item, index) => (
                                        <Button
                                            key={index}
                                            style={{ justifyContent: 'flex-start' }}
                                            onClick={() =>
                                                router.push(`/anime/${titleInfo.code}/episodes/${item.episode}`)
                                            }
                                        >
                                            {`${item.episode} эпизод`}
                                        </Button>
                                    ))
                                ) : (
                                    <h2>В скором времени добавятся</h2>
                                )}
                                {titleInfo.player.list.length > 7 && (
                                    <Button onClick={toggleShowMore}>
                                        {showMore ? `Скрыть (${remainingCount})` : `Показать еще (${remainingCount})`}
                                    </Button>
                                )}
                            </div>

                            {titleInfo.franchises.length > 0 && (
                                <div className={styles.relations}>
                                    <h4>Порядок просмотра</h4>
                                    <ul className={styles.relations_list}>
                                        {titleInfo.franchises[0].releases.length > 0 &&
                                            titleInfo.franchises[0].releases.map((item: any) => {
                                                if (item.code === titleInfo.code) {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={clsx(styles.relations_list_item, styles.active)}
                                                        >
                                                            <div className={styles.item_info}>
                                                                <h4>{item.names.ru}</h4>
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className={styles.relations_list_item}
                                                            onClick={() => router.push(`/anime/${item.code}`)}
                                                        >
                                                            <div className={styles.item_info}>
                                                                <h4>{item.names.ru}</h4>
                                                            </div>
                                                        </div>
                                                    )
                                                }
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
