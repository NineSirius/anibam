import React, { useEffect } from 'react'
import styles from './Backdrop.module.sass'
import clsx from 'clsx'
import { useState } from 'react'

interface BackdropProps {
    show: boolean
    onClose: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ show, onClose }): JSX.Element => {
    return (
        <div
            className={clsx(styles.backdrop, show && styles.active, styles.blur)}
            id="backdrop"
            onClick={onClose}
        ></div>
    )
}
