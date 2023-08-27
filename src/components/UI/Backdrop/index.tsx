import React, { useEffect } from 'react'
import styles from './Backdrop.module.sass'
import clsx from 'clsx'
import { useState } from 'react'

interface BackdropProps {
    show: boolean
    onClose: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ show, onClose }): JSX.Element => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        if (window.innerWidth <= 700) {
            setIsMobile(true)
        } else if (window.innerWidth > 700) {
            setIsMobile(false)
        }
    }, [])
    return (
        <div
            className={clsx(
                styles.backdrop,
                show && styles.active,
                isMobile ? styles.shadow : styles.blur,
            )}
            id="backdrop"
            onClick={onClose}
        ></div>
    )
}
