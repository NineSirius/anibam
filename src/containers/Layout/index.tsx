import { Navbar } from '@/components/Navbar'
import {
    StoreTypes,
    addUserData,
    hideAuthModal,
    removeFromLightGallery,
    setDarkTheme,
    setLightTheme,
    turnOffLoading,
} from '@/store/reducers/user.reducer'
import React, { useCallback, useEffect, useState } from 'react'
import ImageViewer from 'react-simple-image-viewer'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from '@/components/UI/Modal'
import { LoginForm } from '@/components/Auth/LoginForm'
import { useRouter } from 'next/router'
import Cookie from 'js-cookie'
import { getUserData } from '@/api'
import { Footer } from '@/components/Footer'

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [currentImage, setCurrentImage] = useState<number>(0)

    const theme = useSelector((store: StoreTypes) => store.theme)
    const loading = useSelector((store: StoreTypes) => store.loading)
    const images = useSelector((store: StoreTypes) => store.lightgallery)

    const router = useRouter()

    const dispatch = useDispatch()

    useEffect(() => {
        const token = Cookie.get('auth_token')
        if (token) {
            const data = getUserData(token)
            console.log(data)
        }
    }, [])

    useEffect(() => {
        console.log(router)
    }, [router])

    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                localStorage.setItem('theme', 'dark')
                document.body.classList.add('dark')
                dispatch(setDarkTheme())
            } else {
                localStorage.setItem('theme', 'light')
                document.body.classList.add('light')
                dispatch(setLightTheme())
            }
        } else {
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark')
                dispatch(setDarkTheme())
            } else {
                document.body.classList.add('light')
                dispatch(setLightTheme())
            }
        }
    }, [dispatch])

    const closeImageViewer = () => {
        setCurrentImage(0)
        dispatch(removeFromLightGallery())
    }

    return (
        <>
            <div
                className={clsx('app', theme)}
                style={{
                    // background:
                    //     router.pathname === '/anime/[title]'
                    //         ? 'linear-gradient(90deg, rgb(2, 0, 36) 0%, rgb(31, 31, 34) 45%, rgb(40, 3, 10) 100%)'
                    //         : 'unset',
                    transition: '0.3s',
                }}
            >
                {router.asPath !== '/auth/login' && router.asPath !== '/auth/register' && (
                    <Navbar />
                )}
                <div>{children}</div>
                {router.asPath !== '/auth/login' && router.asPath !== '/auth/register' && (
                    <Footer />
                )}
            </div>

            {images.length > 0 && (
                <ImageViewer
                    src={images}
                    currentIndex={currentImage}
                    onClose={closeImageViewer}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: 'rgba(0,0,0,0.9)',
                    }}
                    closeOnClickOutside={true}
                />
            )}
            <Modal show={loading} onClose={() => dispatch(turnOffLoading())}>
                Загрузка
            </Modal>
        </>
    )
}

export default Layout
