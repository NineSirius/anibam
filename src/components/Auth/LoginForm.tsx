import React from 'react'
import styles from './form.module.sass'
import { useState } from 'react'
import { TextField } from '../UI/TextField'
import { Button } from '@/components/UI/Button'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { LoginData, loginUser } from '@/api'
import { useDispatch } from 'react-redux'
import { addUserData } from '@/store/reducers/user.reducer'
import { enqueueSnackbar } from 'notistack'

export const LoginForm = () => {
    const [user, setUser] = useState<LoginData>({
        identifier: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [showPass, setShowPass] = useState<boolean>(false)

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
        loginUser(user)
            .then((resp: any) => {
                console.log(resp)
                Cookie.set('auth_token', resp.jwt)
                enqueueSnackbar('Вы успешно авторизовались', {
                    variant: 'success',
                })
                router.push('/')
            })
            .catch((err) => {
                console.log(err)
                if (err?.response?.data?.error?.message) {
                    const errorMessage = err?.response.data.error.message
                    switch (errorMessage) {
                        case 'Invalid identifier or password':
                            enqueueSnackbar('Неправильный логин или пароль', {
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
                } else {
                    if (
                        err?.response?.data?.message[0]?.messages[0]?.message &&
                        err?.response?.data?.message[0]?.messages[0]?.message ===
                            'Too many attempts, please try again in a minute.'
                    ) {
                        enqueueSnackbar('Превышен лимит запросов, попробуйте позже.', {
                            variant: 'error',
                        })
                    } else if (err.message === 'Network Error') {
                        enqueueSnackbar('Не удалось отправить запрос, попробуйте позже', {
                            variant: 'error',
                            autoHideDuration: 3000,
                        })
                    }
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <h3 className={styles.form_title}>Авторизация</h3>

            <label className={styles.form_label}>
                {/* <h4 className={styles.form_label_text}>Имя пользователя или email</h4> */}
                <TextField
                    label="Имя пользователя или email"
                    type="text"
                    onChange={change}
                    name="identifier"
                />
            </label>

            <label className={styles.form_label}>
                {/* <h4 className={styles.form_label_text}>Имя пользователя или email</h4> */}
                <TextField
                    label="Пароль"
                    type={showPass ? 'text' : 'password'}
                    onChange={change}
                    name="password"
                />
            </label>

            <Link href="/auth/register">У меня нет аккаунта</Link>
            <Button color="primary" type="submit" loading={loading} disabled={loading}>
                Войти
            </Button>
        </form>
    )
}
