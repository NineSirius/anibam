import React from 'react'
import clsx from 'clsx'
import styles from './Navbar.module.sass'
import { Button } from '../UI/Button'
import { MdDarkMode, MdLightMode, MdList, MdLogout, MdSettings } from 'react-icons/md'
import { Backdrop } from '../UI/Backdrop'
import { useDispatch, useSelector } from 'react-redux'
import { StoreTypes, removeUserData, showAuthModal } from '@/store/reducers/user.reducer'
import { LoginForm } from '../Auth/LoginForm'
import Image from 'next/image'
import Cookie from 'js-cookie'
import { Menu } from '../UI/Menu'
import { useRouter } from 'next/router'

export const Navbar = () => {
    const [drawerShow, setDrawerShow] = React.useState<boolean>(false)

    const handleHamburger = () => setDrawerShow(!drawerShow)

    const user = useSelector((store: StoreTypes) => store.user)
    const router = useRouter()
    const dispatch = useDispatch()

    return (
        <>
            <header className={styles.navbar}>
                <nav className="container">
                    <div className={styles.nav_left}>
                        <Button className={styles.hamburger} onClick={handleHamburger}>
                            <MdList />
                        </Button>
                        <Button className={styles.logo}>AniBam</Button>
                    </div>

                    <ul className={clsx(styles.nav_links, drawerShow && styles.active)}>
                        <div className={styles.mobile_logo_wrap}>
                            <Button className={styles.logo}>AniBam</Button>
                            <Button>
                                <MdDarkMode />
                            </Button>
                        </div>
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
                        <Menu label={<MdDarkMode />}>
                            <Button
                                style={{
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                }}
                                onClick={() => {
                                    localStorage.setItem('theme', 'light')
                                    document.body.classList.remove('dark')
                                    document.body.classList.add('light')
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
                                }}
                            >
                                <MdDarkMode size={20} />
                                Тёмная
                            </Button>
                        </Menu>
                        {user ? (
                            <Menu label={user.username}>
                                <div>
                                    <Button style={{ borderRadius: 0 }}>
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
                                        <MdSettings size={20} /> Настройки
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
                            <Button onClick={() => router.push('/auth/login')}>
                                Аккаунт
                            </Button>
                        )}
                    </div>
                </nav>
            </header>

            <Backdrop show={drawerShow} onClose={handleHamburger} />
        </>
    )
}
