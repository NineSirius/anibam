import React from 'react'
import styles from './TextField.module.sass'
import { MdSearch } from 'react-icons/md'

interface TextField {
    label: string
    name?: string
    type?: 'password' | 'text' | 'email' | 'date' | 'number'
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    id?: number | string
    loading?: boolean
}

export const TextField: React.FC<TextField> = ({ label, type, onChange, name, loading }) => {
    return (
        <>
            <div>
                <input
                    type={type ? type : 'text'}
                    name={name}
                    onChange={onChange}
                    placeholder={label}
                    className={styles.input}
                />
                {loading && <MdSearch />}
            </div>
        </>
    )
}
