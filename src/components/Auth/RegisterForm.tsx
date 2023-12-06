import React from 'react'
import styles from './form.module.sass'
import { useState } from 'react'
import { TextField } from '../UI/TextField'
import { Button } from '@/components/UI/Button'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { RegisterData, registerUser } from '@/api'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar } from 'notistack'

export const RegisterForm = () => {
    const [user, setUser] = useState<RegisterData>({
        email: '',
        username: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)

    const dispatch = useDispatch()
    const router = useRouter()

    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev: any) => {
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        registerUser(user)
            .then((resp: any) => {
                Cookie.set('auth_token', resp.jwt)
                enqueueSnackbar('Ваш аккаунт успешно зарегистрирован', {
                    variant: 'success',
                })
            })
            .catch((err) => {
                const errorMessage = err.response.data.error.message
                switch (errorMessage) {
                    case 'Email or Username are already taken':
                        enqueueSnackbar('Email или имя пользователья заняты', {
                            variant: 'error',
                        })
                        break
                    case 'email must be a valid email':
                        enqueueSnackbar('Введите правильный email', {
                            variant: 'error',
                        })
                        break
                    default:
                        break
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <h3 className={styles.form_title}>Регистрация</h3>

            <label className={styles.form_label}>
                {/* <h4 className={styles.form_label_text}>Имя пользователя или email</h4> */}
                <TextField label="Введите свой email*" type="email" onChange={change} name="email" required />
            </label>

            <label className={styles.form_label}>
                {/* <h4 className={styles.form_label_text}>Имя пользователя или email</h4> */}
                <TextField label="Введите имя пользователя*" type="text" onChange={change} name="username" required />
            </label>

            <label className={styles.form_label}>
                {/* <h4 className={styles.form_label_text}>Имя пользователя или email</h4> */}
                <TextField label="Пароль*" type="password" onChange={change} name="password" required />
            </label>

            <Link href="/auth/login">У меня есть аккаунт</Link>
            <Button color="primary" type="submit" loading={loading} disabled={loading}>
                Войти
            </Button>
        </form>
    )
}
