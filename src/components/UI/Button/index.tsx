import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.sass'

interface ButtonProps {
    title: string
    variant?: 'contained' | 'outlined'
    color?: 'success' | 'error' | 'warning' | 'info' | 'primary'
    onPress?: () => void
    href?: string
}

export const Button: React.FC<ButtonProps> = ({ title, variant, color, onPress }) => {
    return (
        <button className={clsx(styles.button, color)} onClick={onPress}>
            {title}
        </button>
    )
}
