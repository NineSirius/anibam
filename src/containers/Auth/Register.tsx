import React, { FormEventHandler, useState } from 'react'
import styles from './auth.module.sass'
import { Button } from '@/components/UI/Button'
import { MdArrowBack, MdDarkMode, MdHome, MdLaptop, MdLightMode } from 'react-icons/md'
import { useRouter } from 'next/router'

import { RegisterForm } from '@/components/Auth/RegisterForm'
import { useDispatch, useSelector } from 'react-redux'
import { StoreTypes, setDarkTheme, setLightTheme } from '@/store/reducers/user.reducer'
import { Menu } from '@/components/UI/Menu'
import Head from 'next/head'

export const RegisterPage = () => {
    const router = useRouter()
    const theme = useSelector((store: StoreTypes) => store.theme)
    const dispatch = useDispatch()

    return (
        <>
            <Head>
                <title>Регистрация нового аккаунта на AniBam</title>
            </Head>
            <div className={styles.form_wrapper}>
                <div className={styles.controls}>
                    <Button onClick={() => router.back()}>
                        <MdArrowBack />
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        <MdHome />
                    </Button>
                    <Menu label={theme === 'dark' ? <MdDarkMode /> : <MdLightMode />}>
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
                </div>
                <RegisterForm />
            </div>
        </>
    )
}
