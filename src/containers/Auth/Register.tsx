import React, { FormEventHandler, useState } from 'react'
import styles from './auth.module.sass'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { Button } from '@/components/UI/Button'
import { RegisterData, registerUser } from '@/api'
import { enqueueSnackbar } from 'notistack'

export const RegisterPage = () => {
    const [userData, setUserData] = useState<RegisterData>({
        email: '',
        username: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const router = useRouter()

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        registerUser(userData)
            .then((resp) => {
                Cookie.set('auth_token', resp.jwt)
                enqueueSnackbar('Аккаунт успешно зарегистрирован', { variant: 'success' })
                router.push('/')
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className={styles.form_wrapper} style={{ flexDirection: 'row-reverse' }}>
            <div className={styles.form_field_wrap}>
                <form className={styles.form} onSubmit={submit}>
                    <p className={styles.form_title}>
                        Sign Up in <strong>Game Store</strong>
                    </p>
                    <div className={styles.form_field}>
                        <input type="text" id="username" required name="email" onChange={change} />
                        <label htmlFor="username" className={styles.form_field_label}>
                            Email
                        </label>
                    </div>
                    <div className={styles.form_field}>
                        <input
                            type="text"
                            id="username"
                            required
                            name="username"
                            onChange={change}
                        />
                        <label htmlFor="username" className={styles.form_field_label}>
                            Имя пользователя
                        </label>
                    </div>
                    <div className={styles.form_field}>
                        <input
                            type="password"
                            id="username"
                            required
                            name="password"
                            onChange={change}
                        />
                        <label htmlFor="username" className={styles.form_field_label}>
                            Пароль
                        </label>
                    </div>
                    <Button color="primary" type="submit">
                        Зарегистрироваться
                    </Button>

                    <p>
                        Есть аккаунт?{' '}
                        <Link href="/auth/login" className="link">
                            Авторизуйтесь
                        </Link>
                    </p>
                </form>
            </div>
            <div className={styles.form_bg}></div>
        </div>
    )
}
