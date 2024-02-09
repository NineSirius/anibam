import React, { useState, useRef, useEffect, CSSProperties } from 'react'
import styles from './Menu.module.sass'
import { Button } from '../Button'
import clsx from 'clsx'

interface MenuProps {
    children: React.ReactNode
    label: React.ReactNode
    labelStyle?: CSSProperties
    className?: any
}

export const Menu: React.FC<MenuProps> = ({ children, label, labelStyle, className }): JSX.Element => {
    const [show, setShow] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const handleShow = () => setShow(!show)

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShow(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <div className={clsx(styles.menu, className && className)} ref={menuRef}>
            <Button onClick={handleShow} style={labelStyle}>
                {label}
            </Button>
            <div className={clsx(styles.menu_content, show && styles.active)}>{children}</div>
        </div>
    )
}
