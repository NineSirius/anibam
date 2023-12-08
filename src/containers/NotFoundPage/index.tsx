import React from 'react'
import styles from './NotFoundPage.module.sass'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { StoreTypes } from '@/store/reducers/user.reducer'
import { Button } from '@/components/UI/Button'
import { MdArrowBack, MdHome } from 'react-icons/md'

export const NotFoundPage = () => {
    const theme = useSelector((store: StoreTypes) => store.theme)

    return (
        <div className={`${styles.page} container`}>
            <Image src={`/img/404-${theme}.png`} alt="404" width={390} height={500} className={styles.image} />

            <p className={styles.text}>
                Страница как ниндзя — исчезла в тени. (╯°□°）╯︵ ┻━┻ Но не отчаивайтесь, вернитесь на главный экран и
                начните новые приключения! (¬‿¬)✨
            </p>

            <div className={styles.controls}>
                <Button onClick={() => window.history.back()}>
                    <MdArrowBack /> Назад
                </Button>
                <Button type="link" href="/">
                    <MdHome /> Домой
                </Button>
            </div>
        </div>
    )
}
