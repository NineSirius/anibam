import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Navbar.module.sass'
import { Button } from '../UI/Button'
import {
    MdDarkMode,
    MdFeaturedPlayList,
    MdForum,
    MdHome,
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
import { StoreTypes, addUserData, removeUserData, setDarkTheme, setLightTheme } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Cookie from 'js-cookie'
import { Menu } from '../UI/Menu'
import { useRouter } from 'next/navigation'
import { getAnilibriaRandomTitle, getUserData } from '@/api'
import { Search } from '../Search'
import { AuthUserMenu } from './AuthUserMenu'

export const Navbar = () => {
    const [searchShow, setSearchShow] = useState<boolean>(false)
    const [isBottomBar, setIsBottomBar] = useState<boolean>(true)

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

    const getRandom = () => {
        getAnilibriaRandomTitle().then((resp) => router.push(`/anime/${resp.code}`))
    }

    const links = [
        { icon: <MdHome size={24} />, title: 'Главная', onClick: () => router.push('/') },
        { icon: <MdLibraryBooks size={24} />, title: 'Каталог', onClick: () => router.push('/anime') },
        { icon: <MdShuffle size={24} />, title: 'Случайное', onClick: () => getRandom() },
    ]

    useEffect(() => {
        let lastScrollTop = 0

        window.addEventListener('scroll', function () {
            let scrollTop = window.scrollY || document.documentElement.scrollTop

            if (scrollTop > lastScrollTop) {
                if (isBottomBar) {
                    setIsBottomBar(false)
                }
            } else {
                setIsBottomBar(true)
            }

            lastScrollTop = scrollTop
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <header className={styles.navbar}>
                <nav className="container">
                    <div className={styles.nav_left}>
                        <Button className={styles.logo} onClick={() => router.push('/')}>
                            AniBam
                        </Button>
                    </div>

                    <ul className={styles.nav_links}>
                        {/* <div className={styles.mobile_logo_wrap}>
                            <Button>
                                <MdDarkMode />
                            </Button>
                        </div> */}
                        <li>
                            <Button className={styles.logo}>AniBam</Button>
                        </li>
                        <li>
                            <Button onClick={() => router.push('/anime')}>
                                <MdLibraryBooks size={20} className={styles.icon} />
                                Каталог
                            </Button>
                        </li>
                        <li>
                            <Button onClick={getRandom}>
                                <MdShuffle size={20} className={styles.icon} /> Случайное аниме
                            </Button>
                        </li>
                    </ul>

                    <div className={styles.nav_right}>
                        <Button onClick={() => setSearchShow(true)}>
                            <MdSearch size={20} />
                        </Button>
                        <Menu label={theme === 'dark' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}>
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
                            <AuthUserMenu user={user} router={router} />
                        ) : (
                            <>
                                <Button onClick={() => router.push('/auth/login')} className={styles.account_full}>
                                    Аккаунт
                                </Button>
                                <Button onClick={() => router.push('/auth/login')} className={styles.account_icon}>
                                    <MdPerson size={20} />
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <div className={clsx(styles.bottom_bar, isBottomBar && styles.active)}>
                {links.map((link) => {
                    return (
                        <button className={styles.button} key={link.title} onClick={link.onClick}>
                            {link.icon}
                            <span>{link.title}</span>
                        </button>
                    )
                })}
            </div>

            <Search show={searchShow} onClose={handleSearchShow} />
        </>
    )
}
