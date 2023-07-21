import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.sass'
import clsx from 'clsx'

export const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={clsx(styles.footer_content, 'container')}>
                <div className={styles.footer_content_col}>
                    <h2 className={styles.footer_content_title}>AniBam.app</h2>
                    <p className={styles.footer_content_desc}>Крутой сайт для просмотра аниме.</p>
                </div>
                <div className={styles.footer_content_col}>
                    <Link href="/android-app" className={styles.footer_content_link}>
                        Приложение для Android.
                    </Link>
                    <Link href="/pc-app" className={styles.footer_content_link}>
                        Приложение для ПК.
                    </Link>
                </div>
            </div>
        </div>
    )
}
