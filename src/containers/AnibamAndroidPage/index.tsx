import Image from 'next/image'
import styles from './AnibamAndroidPage.module.sass'
import { FaGithub } from 'react-icons/fa6'
import { Button } from '@/components/UI/Button'
import { MdDownload } from 'react-icons/md'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export const AnibamAndroidPage = () => {
    const { enqueueSnackbar } = useSnackbar()

    return (
        <div className={styles.page}>
            <Image
                src="/img/anibam-android/base-example.png"
                alt="Anibam Android"
                width={1040}
                height={1280}
                className={styles.app_example}
            />

            <h1>Anibam Android</h1>
            <p>Мобильное приложения для просмотра аниме в озвучке от AniLibria</p>
            <p>Приложение находится в разработке</p>

            <div className={styles.controls}>
                <Button color="primary" className={styles.btn} disabled>
                    <MdDownload />
                    Скачать (В разработке)
                </Button>
                <Button
                    color="primary"
                    className={styles.btn}
                    onClick={() =>
                        enqueueSnackbar('Появится после релиза', { variant: 'info', autoHideDuration: 2000 })
                    }
                >
                    <FaGithub />
                    Исходный код
                </Button>
            </div>
        </div>
    )
}
