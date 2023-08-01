import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './ProfilePage.module.sass'
import { StoreTypes, UserTypes } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal } from '@/components/UI/Modal'
import { Button } from '@/components/UI/Button'
import { getUserByUsername, getUserData } from '@/api'
import { BsGithub, BsTelegram } from 'react-icons/bs'
import Cookie from 'js-cookie'
import Link from 'next/link'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

interface Profile {
    data: UserTypes | 'None'
}

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<UserTypes | null>(null)

    const router = useRouter()
    const user = useSelector((store: StoreTypes) => store.user)

    useEffect(() => {
        if (router.query.username && typeof router.query.username === 'string') {
            getUserByUsername(router.query.username).then((resp) => {
                setUserInfo(resp[0])
            })
        }
    }, [router])

    if (userInfo && router.query.username) {
        return (
            <>
                <Head>
                    <title>Профиль пользователя {userInfo?.username}</title>
                </Head>
                <div className={clsx(styles.profile, 'container')}>
                    <div className={styles.profile_header}>
                        <div className={styles.avatar_wrap}>
                            <div className={styles.avatar}>
                                {userInfo.avatar ? (
                                    <Image
                                        src={userInfo.avatar.url}
                                        width={500}
                                        height={500}
                                        alt={`Аватарка пользователя ${userInfo.username}`}
                                    />
                                ) : (
                                    userInfo.username[0].toUpperCase()
                                )}
                            </div>
                        </div>

                        <div className={styles.user_info}>
                            <div className={styles.username}>
                                <h2>{userInfo.username}</h2>
                            </div>

                            <p className={styles.description}>
                                {userInfo.description || 'Пользователь не добавил описание'}
                            </p>
                            {userInfo.username === user?.username && (
                                <Button
                                    style={{ marginTop: 10 }}
                                    onClick={() => router.push(`/users/${user.username}/edit`)}
                                >
                                    Редактировать профиль
                                </Button>
                            )}
                            {/* <ul className={styles.profile_links}>
                                {userInfo.github_link && (
                                    <Button>
                                        <BsGithub size={20} /> GitHub
                                    </Button>
                                )}
                                {userInfo.telegram_link && (
                                    <Button>
                                        <Image
                                            src="/img/telegram-logo.webp"
                                            width={20}
                                            height={20}
                                            alt="Telegram"
                                        />
                                        Telegram
                                    </Button>
                                )}
                            </ul> */}
                        </div>
                    </div>

                    <div className={styles.profile_main}>
                        <aside className={styles.side_info}>Ссылки</aside>

                        <div className={styles.posts}></div>
                    </div>
                </div>
            </>
        )
    }
}

export default ProfilePage
