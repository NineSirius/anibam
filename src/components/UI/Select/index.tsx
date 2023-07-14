import React, { useEffect, useRef, useState } from 'react'
import styles from './Select.module.sass'
import { MdUnfoldLess, MdUnfoldMore } from 'react-icons/md'
import clsx from 'clsx'

interface SelectProps {
    options: string[]
    value: string
    onChange: (selectedValue: string) => void
    className?: any
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false)
    const SelectRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (SelectRef.current && !SelectRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue)
        setIsOpen(false)
    }

    return (
        <div className={clsx(styles.select, className && className)} ref={SelectRef}>
            <button className={styles.selectedOption} onClick={() => setIsOpen(!isOpen)}>
                {value}
                {isOpen ? <MdUnfoldLess /> : <MdUnfoldMore />}
            </button>
            <ul className={clsx(styles.options, isOpen && styles.active)}>
                {options.map((option) => (
                    <button
                        key={option}
                        className={clsx(styles.option, option === value && styles.active)}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </ul>
        </div>
    )
}
