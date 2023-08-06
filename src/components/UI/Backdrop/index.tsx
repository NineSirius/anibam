import React, { useEffect } from 'react'
import styles from './Backdrop.module.sass'
import clsx from 'clsx'

interface BackdropProps {
    show: boolean
    onClose: () => void
}

export const Backdrop: React.FC<BackdropProps> = ({ show, onClose }): JSX.Element => {
    useEffect(() => {
        const handleResize = () => {
            console.log(window.innerWidth)

            const backdropElement = document.querySelector('.backdrop') as HTMLElement | null
            if (backdropElement) {
                const backdropFilter = window.innerWidth > 600 ? 'blur(5px)' : 'none'
                backdropElement.style.setProperty('backdrop-filter', backdropFilter)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <div className={clsx(styles.backdrop, show && styles.active)} onClick={onClose}></div>
}
