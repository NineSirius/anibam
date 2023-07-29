import React, { useEffect, useState } from 'react'
import styles from './ProfilePage.module.sass'
import clsx from 'clsx'
import { TextField } from '@/components/UI/TextField'
import { UserTypes } from '@/store/reducers/user.reducer'
import { getUserData } from '@/api'
import Cookie from 'js-cookie'
import { Button } from '@/components/UI/Button'
import { enqueueSnackbar } from 'notistack'

export const ProfilePageEdit = () => {
    const [userInfo, setUserInfo] = useState<UserTypes | null>(null)
    const [userInfoEdit, setUserInfoEdit] = useState<any>({
        avatar: null,
        username: null,
        email: null,
    })

    useEffect(() => {
        const token = Cookie.get('auth_token')
        if (token) {
            getUserData(token).then((resp) => setUserInfo(resp))
        }
    }, [])

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfoEdit((prev: any) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    if (userInfo) {
        return (
            <div className={clsx(styles.form, 'container')}>
                <h2>Редактирование профиля</h2>

                <TextField
                    label="Имя пользователя"
                    name="username"
                    value={userInfoEdit.username ? userInfoEdit.username : userInfo.username}
                    onChange={change}
                />

                <Button color="primary" onClick={() => enqueueSnackbar('Пока в разработке')}>
                    Сохранить
                </Button>
            </div>
        )
    }
}
