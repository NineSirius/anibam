import Image from 'next/image'
import styles from './AnibamAndroidPage.module.sass'
import { FaGithub } from 'react-icons/fa6'
import { Button } from '@/components/UI/Button'
import { MdDownload } from 'react-icons/md'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export const AnibamAndroidPage = () => {
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        let deferredPrompt: any = null
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            deferredPrompt = e
        })

        const installApp = document.getElementById('installPWA')
        if (installApp) {
            installApp.addEventListener('click', () => {
                if (deferredPrompt !== null) {
                    deferredPrompt.prompt()
                    deferredPrompt.userChoice.then((result: any) => {
                        if (result === 'accepted') {
                            deferredPrompt = null
                        }
                    })
                } else {
                    enqueueSnackbar('Не удалось установить', { variant: 'error' })
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            <p>
                Пока что мы используем технологию{' '}
                <a href="https://ru.wikipedia.org/wiki/WPA" target="_blank">
                    WPA
                </a>
                , но вскоре разработаем полноценно мобильное приложение
            </p>

            <div className={styles.controls}>
                <Button color="primary" className={styles.btn} id="installPWA">
                    <MdDownload />
                    Установить (WPA)
                </Button>
                <Button color="primary" className={styles.btn} type="link" href="https://github.com/NineSirius/anibam">
                    <FaGithub />
                    Исходный код
                </Button>
            </div>
        </div>
    )
}
