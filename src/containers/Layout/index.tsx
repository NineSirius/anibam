import { Navbar } from '@/components/Navbar'
import { StoreTypes, addUserData, hideAuthModal } from '@/store/reducers/user.reducer'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from '@/components/UI/Modal'
import { LoginForm } from '@/components/Auth/LoginForm'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
import { getUserData } from '@/api'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const theme = useSelector((store: StoreTypes) => store.theme)
    const authModal = useSelector((store: StoreTypes) => store.authModal)
    const token = useSelector((store: StoreTypes) => store.token)
    const user = useSelector((store: StoreTypes) => store.user)

    const { asPath } = useRouter()

    const dispatch = useDispatch()

    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                localStorage.setItem('theme', 'dark')
                document.body.classList.add('dark')
            } else {
                localStorage.setItem('theme', 'light')
                document.body.classList.add('light')
            }
        } else {
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark')
            } else {
                document.body.classList.add('light')
            }
        }
    }, [])

    // useEffect(() => {
    //     let token = Cookie.get('auth_token')
    //     if (token && !user) {
    //         getUserData(token)
    //             .then((resp) => {
    //                 dispatch(addUserData({ user: resp, token: token }))
    //             })
    //             .catch((err) => console.log(err))
    //     }
    // }, [token, user])

    return (
        <div className={clsx('app', theme)}>
            {asPath !== '/auth/login' && asPath !== '/auth/register' && <Navbar />}
            <div>{children}</div>
        </div>
    )
}

export default Layout
