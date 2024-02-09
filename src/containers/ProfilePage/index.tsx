import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './ProfilePage.module.sass'
import { StoreTypes } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Head from 'next/head'
import { useParams, useRouter } from 'next/navigation'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '@/components/UI/Button'
import { getUserByUsername } from '@/api'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { UserT } from '../types/UserT'
import { Avatar } from '@/components/UI/Avatar'

const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState<UserT | null>(null)

    const router = useRouter()
    const params = useParams()
    const user = useSelector((store: StoreTypes) => store.user)

    useEffect(() => {
        if (params.username && typeof params.username === 'string') {
            getUserByUsername(params.username).then((resp) => {
                setUserInfo(resp[0])
            })
        }
    }, [params.username])

    if (userInfo && params.username) {
        return (
            <>
                <Head>
                    <title>Профиль пользователя {userInfo?.username}</title>
                </Head>
                <div className={clsx(styles.profile_layout, 'container')}>
                    <div className={styles.left}>
                        <div className={`${styles.profile_card} card`}>
                            <Avatar username={userInfo.username} url={userInfo.avatar.url} size={{ x: 150, y: 150 }} />
                            <h2 className={styles.username}>{userInfo.username}</h2>
                            <p>{userInfo.gender === 'female' ? 'Жен' : userInfo.gender === 'male' && 'Муж'}</p>
                        </div>
                    </div>
                    <div className={styles.right}></div>
                </div>
            </>
        )
    }
}

export default ProfilePage
