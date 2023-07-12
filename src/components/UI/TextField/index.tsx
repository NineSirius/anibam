import React from 'react'
import styles from './TextField.module.sass'

interface TextField {
    label: string
    name?: string
    type: 'password' | 'text' | 'email' | 'date' | 'number'
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextField: React.FC<TextField> = ({ label, type, onChange, name }) => {
    return (
        <input
            type={type}
            name={name}
            onChange={onChange}
            placeholder={label}
            className={styles.input}
        />
    )
}
