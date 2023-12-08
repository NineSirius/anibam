import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Navbar.module.sass'
import { Button } from '../UI/Button'
import {
    MdDarkMode,
    MdFeaturedPlayList,
    MdForum,
    MdLaptop,
    MdLibraryBooks,
    MdLightMode,
    MdLogout,
    MdMenu,
    MdPeople,
    MdPerson,
    MdSearch,
    MdShuffle,
    MdTune,
    MdVerifiedUser,
} from 'react-icons/md'
import { Backdrop } from '../UI/Backdrop'
import { useDispatch, useSelector } from 'react-redux'
import { removeUserData } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Cookie from 'js-cookie'
import { Menu } from '../UI/Menu'
import { UserT } from '@/containers/types/UserT'

type AuthUserMenuProps = {
    user: UserT
    router: any
}

export const AuthUserMenu: React.FC<AuthUserMenuProps> = ({ user, router }) => {
    const dispatch = useDispatch()
    return (
        <Menu label={user.username}>
            <div>
                <Button style={{ borderRadius: 0 }} onClick={() => router.push(`/users/${user.username}`)}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: 300,
                        }}
                    >
                        <Image
                            src={user.avatar ? user.avatar.url : '/img/base-avatar.png'}
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover' }}
                            alt={`Аватарка пользователя ${user.username}`}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 5,
                            }}
                        >
                            <h4>{user.username}</h4>
                            <p className={styles.role}>
                                {user.role.name === 'Authenticated' && 'Пользователь'}
                                {user.role.name === 'Owner' && 'Владелец'}
                            </p>
                        </div>
                    </div>
                </Button>
                {user.role.name === 'Owner' && (
                    <Button
                        style={{
                            borderRadius: 0,
                            alignItems: 'center',
                            gap: 10,
                            justifyContent: 'flex-start',
                        }}
                        onClick={() => router.replace('http://localhost:1337/admin')}
                    >
                        <MdTune size={20} /> Панель администратора
                    </Button>
                )}
                <Button
                    style={{
                        borderRadius: 0,
                        alignItems: 'center',
                        gap: 10,
                        justifyContent: 'flex-start',
                    }}
                >
                    <MdPeople size={20} /> Друзья
                </Button>
                <Button
                    style={{
                        borderRadius: 0,
                        alignItems: 'center',
                        gap: 10,
                        justifyContent: 'flex-start',
                    }}
                >
                    <MdForum size={20} /> Сообщения
                </Button>
                <Button
                    style={{
                        borderRadius: 0,
                        alignItems: 'center',
                        gap: 10,
                        justifyContent: 'flex-start',
                        color: '#EE4343',
                    }}
                    onClick={() => {
                        dispatch(removeUserData())
                        Cookie.remove('auth_token')
                    }}
                >
                    <MdLogout size={20} /> Выйти с аккаунта
                </Button>
            </div>
        </Menu>
    )
}
