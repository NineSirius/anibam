import React from 'react'
import styles from './Backdrop.module.sass'
import clsx from 'clsx'

interface BackdropProps {
    show: boolean
    onClose: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ show, onClose }): JSX.Element => {
    return (
        <div
            className={clsx(styles.backdrop, show && styles.active)}
            onClick={onClose}
        ></div>
    )
}
