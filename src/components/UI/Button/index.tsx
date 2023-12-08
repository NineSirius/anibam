import React from 'react'
import styles from './Button.module.sass'
import clsx from 'clsx'

interface ButtonProps {
    id?: string
    children: React.ReactNode
    variant?: 'contained' | 'outline'
    className?: any
    onClick?: () => void
    color?: 'primary' | 'warning' | 'error' | 'success'
    type?: 'submit' | 'button' | 'link'
    style?: React.CSSProperties | undefined
    loading?: boolean
    disabled?: boolean
    href?: string
}

export const Button: React.FC<ButtonProps> = ({
    id,
    children,
    variant,
    className,
    onClick,
    color,
    type,
    style,
    loading,
    disabled,
    href,
}): JSX.Element => {
    if (type === 'link' && href) {
        return (
            <a
                id={id}
                className={clsx(
                    styles.button,
                    variant ? styles[variant] : styles.contained,
                    className,
                    color && styles[color],
                )}
                href={href}
                style={style}
            >
                {loading ? 'Загрузка' : children}
            </a>
        )
    } else {
        return (
            <button
                id={id}
                className={clsx(
                    styles.button,
                    variant ? styles[variant] : styles.contained,
                    className,
                    color && styles[color],
                )}
                onClick={onClick}
                type={type !== 'link' ? type : 'button'}
                style={style}
                disabled={disabled}
            >
                {loading ? 'Загрузка' : children}
            </button>
        )
    }
}
