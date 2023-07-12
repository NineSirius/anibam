import React from 'react'
import styles from './form.module.sass'
import { useState } from 'react'
import { TextField } from '../UI/TextField'
import { Button } from '@/components/UI/Button'
import Link from 'next/link'
import Cookie from 'js-cookie'
import { LoginData, loginUser } from '@/api'
import { useDispatch } from 'react-redux'
import { addUserData } from '@/store/reducers/user.reducer'

export const LoginForm = () => {
    const [user, setUser] = useState<LoginData>({
        identifier: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)

    const dispatch = useDispatch()

    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser((prev: any) => {
            return { ...prev, [event.target.name]: event.target.value }
        })
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        loginUser(user).then((resp: any) => {
            console.log(resp)
            Cookie.set('auth_token', resp.jwt)
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
                <TextField label="Пароль" type="password" onChange={change} name="password" />
            </label>

            <Link href="/auth/register">У меня нет аккаунта</Link>
            <Button color="primary" type="submit">
                Войти
            </Button>
        </form>
    )
}
