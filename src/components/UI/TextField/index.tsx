import React from 'react'
import styles from './TextField.module.sass'
import loader from './loader.module.css'
import clsx from 'clsx'
import { MdPassword } from 'react-icons/md'

interface TextField {
    label: string
    name?: string
    type?: 'password' | 'text' | 'email' | 'date' | 'number'
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    id?: number | string
    loading?: boolean
    value?: string
    required?: boolean
    autoFocus?: boolean
    showPass?: boolean
}

export const TextField: React.FC<TextField> = ({
    label,
    type,
    onChange,
    name,
    loading,
    value,
    required,
    autoFocus,
    showPass,
}) => {
    return (
        <>
            <div className={styles.input_wrap}>
                <input
                    type={type ? type : 'text'}
                    name={name}
                    onChange={onChange}
                    placeholder={label}
                    className={styles.input}
                    value={value}
                    required={required}
                    autoFocus={autoFocus}
                />
                {loading && <span className={clsx(styles.search_icon, loader.loader)}></span>}
            </div>
        </>
    )
}
