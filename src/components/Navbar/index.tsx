import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Navbar.module.sass'
import { Button } from '../UI/Button'
import {
    MdDarkMode,
    MdForum,
    MdLaptop,
    MdLightMode,
    MdList,
    MdLogout,
    MdMenu,
    MdPeople,
    MdPerson3,
    MdSearch,
    MdSettings,
} from 'react-icons/md'
import { Backdrop } from '../UI/Backdrop'
import { useDispatch, useSelector } from 'react-redux'
import {
    StoreTypes,
    addUserData,
    removeUserData,
    setDarkTheme,
    setLightTheme,
    showAuthModal,
} from '@/store/reducers/user.reducer'
import { LoginForm } from '../Auth/LoginForm'
import Image from 'next/image'
import Cookie from 'js-cookie'
import { Menu } from '../UI/Menu'
import { useRouter } from 'next/router'
import { getTitleByName, getTitleByTitle, getUserData } from '@/api'
import { TextField } from '../UI/TextField'
import { WatchItemInterface } from '@/containers/HomePage'
import { Search } from '../Search'

export const Navbar = () => {
    const [drawerShow, setDrawerShow] = useState<boolean>(false)
    const [searchShow, setSearchShow] = useState<boolean>(false)

    const handleHamburger = () => setDrawerShow(!drawerShow)
    const handleSearchShow = () => setSearchShow(!searchShow)

    const user = useSelector((store: StoreTypes) => store.user)
    const theme = useSelector((store: StoreTypes) => store.theme)
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        let token = Cookie.get('auth_token')
        if (token && !user) {
            getUserData(token)
                .then((resp) => {
                    dispatch(addUserData({ user: resp, token: token }))
                })
                .catch((err) => console.log(err))
        }
    }, [dispatch, user])

    return (
        <>
            <header className={styles.navbar}>
                <nav className="container">
                    <div className={styles.nav_left}>
                        <Button className={styles.hamburger} onClick={handleHamburger}>
                            <MdMenu size={24} />
                        </Button>
                        <Button className={styles.logo} onClick={() => router.push('/')}>
                            AniBam
                        </Button>
                    </div>

                    <ul className={clsx(styles.nav_links, drawerShow && styles.active)}>
                        {/* <div className={styles.mobile_logo_wrap}>
                            <Button className={styles.logo}>AniBam</Button>
                            <Button>
                                <MdDarkMode />
                            </Button>
                        </div> */}
                        <li>
                            <Button>Аниме</Button>
                        </li>
                        <li>
                            <Button>Фильмы</Button>
                        </li>
                        <li>
                            <Button>Сериалы</Button>
                        </li>
                    </ul>

                    <div className={styles.nav_right}>
                        <Button onClick={() => setSearchShow(true)}>
                            <MdSearch size={20} />
                        </Button>
                        <Menu
                            label={
                                theme === 'dark' ? (
                                    <MdDarkMode size={20} />
                                ) : (
                                    <MdLightMode size={20} />
                                )
                            }
                        >
                            <Button
                                style={{
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                }}
                                onClick={() => {
                                    localStorage.setItem('theme', 'light')
                                    document.body.classList.remove('dark')
                                    document.body.classList.add('light')
                                    dispatch(setLightTheme())
                                }}
                            >
                                <MdLightMode size={20} />
                                Светлая
                            </Button>
                            <Button
                                style={{
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                }}
                                onClick={() => {
                                    localStorage.setItem('theme', 'dark')
                                    document.body.classList.remove('light')
                                    document.body.classList.add('dark')
                                    dispatch(setDarkTheme())
                                }}
                            >
                                <MdDarkMode size={20} />
                                Тёмная
                            </Button>
                            <Button
                                style={{
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                }}
                                onClick={() => {
                                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                        localStorage.setItem('theme', 'dark')
                                        document.body.classList.remove('light')
                                        document.body.classList.add('dark')
                                        dispatch(setDarkTheme())
                                    } else {
                                        localStorage.setItem('theme', 'light')
                                        document.body.classList.remove('dark')
                                        document.body.classList.add('light')
                                        dispatch(setLightTheme())
                                    }
                                }}
                            >
                                <MdLaptop size={20} />
                                Система
                            </Button>
                        </Menu>
                        {user ? (
                            <Menu label={user.username}>
                                <div>
                                    <Button
                                        style={{ borderRadius: 0 }}
                                        onClick={() => router.push('/users/me')}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                width: 300,
                                            }}
                                        >
                                            <Image
                                                src={
                                                    user.avatar
                                                        ? user.avatar.url
                                                        : '/img/base-avatar.png'
                                                }
                                                width={50}
                                                height={50}
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
                                                    {user.role.name === 'Authenticated' &&
                                                        'Пользователь'}
                                                </p>
                                            </div>
                                        </div>
                                    </Button>
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
                        ) : (
                            <Button onClick={() => router.push('/auth/login')}>Аккаунт</Button>
                        )}
                    </div>
                </nav>
            </header>

            <Backdrop show={drawerShow} onClose={handleHamburger} />

            <Search show={searchShow} onClose={handleSearchShow} />
        </>
    )
}
