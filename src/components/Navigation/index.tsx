import Link from 'next/link'
import styles from './Navigation.module.sass'
import clsx from 'clsx'
import { Button } from '../UI/Button'

export const Navigation = () => {
    return (
        <nav className={clsx(styles.navigation, 'container')}>
            <h4 className={clsx(styles.logo, 'logo')}>Logo</h4>
            <div className={styles.nav_link_wrap}>
                <Link href="/" className="nav_link">
                    Главная
                </Link>
                <Link href="/" className="nav_link">
                    Аниме
                </Link>
                <Link href="/" className="nav_link">
                    Подборки
                </Link>
                <Link href="/" className="nav_link">
                    Новости
                </Link>
            </div>

            <div className={styles.right_nav}>
                <Link href="/">Тема</Link>
                <Button title="Вход" />
            </div>
        </nav>
    )
}
