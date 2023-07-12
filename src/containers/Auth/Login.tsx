import React, { FormEventHandler, useState } from 'react'
import styles from './auth.module.sass'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Button } from '@/components/UI/Button'
import { LoginData, loginUser } from '@/api'
import { useDispatch } from 'react-redux'
import { addUserData } from '@/store/reducers/user.reducer'

export const LoginPage = () => {
    const [userData, setUserData] = useState<LoginData>({
        identifier: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const router = useRouter()
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar()

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        // loginUser(userData)
        //     .then((resp) => {
        //         Cookie.set('auth_token', resp.jwt)
        //         enqueueSnackbar('Successful login', {
        //             variant: 'success',
        //             autoHideDuration: 3000,
        //         })
        //         router.push('/')
        //         location.reload()
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }

    return (
        <div className={styles.form_wrapper}>
            <div className={styles.form_field_wrap}>
                <form className={styles.form} onSubmit={submit}>
                    <p className={styles.form_title}>
                        Log in to <strong>AniBam</strong>
                    </p>
                    <div className={styles.form_field}>
                        <input
                            type="text"
                            id="username"
                            required
                            name="identifier"
                            onChange={change}
                        />
                        <label htmlFor="username" className={styles.form_field_label}>
                            Логин
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
                        Войти
                    </Button>
                    <p>
                        Нет аккаунта?{' '}
                        <Link href="/auth/register" className="link">
                            Зарегистрируйтесь
                        </Link>
                    </p>
                </form>
            </div>
            <div className={styles.form_bg}></div>
        </div>
    )
}
