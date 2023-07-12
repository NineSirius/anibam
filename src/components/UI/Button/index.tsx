import React from 'react'
import styles from './Button.module.sass'
import clsx from 'clsx'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'contained' | 'outline'
    className?: string
    onClick?: () => void
    color?: 'primary' | 'warning' | 'error' | 'success'
    type?: 'submit' | 'button'
    style?: React.CSSProperties | undefined
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant,
    className,
    onClick,
    color,
    type,
    style,
}): JSX.Element => {
    return (
        <button
            className={clsx(
                styles.button,
                variant ? styles[variant] : styles.contained,
                className,
                color && styles[color],
            )}
            onClick={onClick}
            type={type}
            style={style}
        >
            {children}
        </button>
    )
}
