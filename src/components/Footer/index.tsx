import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.sass'
import clsx from 'clsx'
import { MdAndroid, MdComputer } from 'react-icons/md'

export const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={clsx(styles.footer_content, 'container')}>
                <div className={styles.footer_content_col}>
                    <h2 className={styles.footer_content_title}>AniBam.app</h2>
                    <p className={styles.footer_content_desc}>Крутой сайт для просмотра аниме.</p>
                </div>
                <div className={styles.footer_content_col} style={{ textAlign: 'center' }}>
                    <Link href="/anibam-android" className={styles.footer_content_link}>
                        <MdAndroid /> AniBam Android.
                    </Link>
                    <Link href="/anibam-desktop" className={styles.footer_content_link}>
                        <MdComputer /> AniBam Desktop.
                    </Link>
                </div>
            </div>
        </div>
    )
}
