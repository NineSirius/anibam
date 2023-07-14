import React, { useState } from 'react'
import styles from './Select.module.sass'
import clsx from 'clsx'

interface SelectProps {
    options: string[]
    value: string
    onChange: (selectedValue: string) => void
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue)
        setIsOpen(false)
    }

    return (
        <div className={styles.select}>
            <div className={styles.selectedOption} onClick={() => setIsOpen(!isOpen)}>
                {value}
            </div>
            {isOpen && (
                <ul className={styles.options}>
                    {options.map((option) => (
                        <li
                            key={option}
                            className={clsx(styles.option, option === value && styles.active)}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
