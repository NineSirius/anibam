import React, { useEffect, useState } from 'react'
import styles from './ProfilePage.module.sass'
import clsx from 'clsx'
import { TextField } from '@/components/UI/TextField'
import { UserTypes } from '@/store/reducers/user.reducer'
import { getUserData, updateUserInfo } from '@/api'
import Cookie from 'js-cookie'
import { Button } from '@/components/UI/Button'
import { enqueueSnackbar } from 'notistack'

export const ProfilePageEdit = () => {
    const [userInfo, setUserInfo] = useState<UserTypes | null>(null)
    const [userInfoEdit, setUserInfoEdit] = useState<any>({})

    useEffect(() => {
        const token = Cookie.get('auth_token')
        if (token) {
            getUserData(token).then((resp) => {
                setUserInfo(resp)
            })
        }
    }, [])

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfoEdit((prev: any) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const token = Cookie.get('auth_token')

        if (userInfo && token) {
            updateUserInfo(userInfo.id, token, userInfoEdit).then((resp) => {
                enqueueSnackbar('Данные успешно изменены', { variant: 'success' })
            })
        }
    }

    if (userInfo) {
        return (
            <form className={clsx(styles.form, 'container')} onSubmit={submit}>
                <h2>Редактирование профиля</h2>

                <label>
                    <span>Имя пользователя</span>
                    <TextField
                        label={userInfo.username}
                        name="username"
                        value={userInfoEdit.username}
                        onChange={change}
                    />
                </label>

                <Button color="primary">Сохранить</Button>
            </form>
        )
    }
}
