import React, { useEffect, useRef, useState } from 'react'
import styles from './Select.module.sass'
import { MdCheck, MdUnfoldLess, MdUnfoldMore } from 'react-icons/md'
import clsx from 'clsx'

type OptionT = {
    key: string | number
    label: string
}
interface SelectProps {
    options: OptionT[]
    activeValue: string | number
    onChange: (selectedValue: string | number) => void
    className?: any
    loading?: boolean
    position?: 'top' | 'bottom'
    optionsClassName?: any
}

export const Select: React.FC<SelectProps> = ({
    options,
    activeValue,
    onChange,
    className,
    loading,
    position,
    optionsClassName,
}) => {
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

    const handleSelect = (selectedValue: string | number) => {
        onChange(selectedValue)
        setIsOpen(false)
    }

    return (
        <div className={clsx(styles.select, className && className)} ref={SelectRef}>
            <button className={styles.selectedOption} onClick={() => setIsOpen(!isOpen)}>
                {options.find((option) => option.key === activeValue)?.label || 'Выберите серию'}
                {isOpen ? (
                    <MdUnfoldLess style={{ pointerEvents: 'none' }} />
                ) : (
                    <MdUnfoldMore style={{ pointerEvents: 'none' }} />
                )}
            </button>
            <ul
                className={clsx(
                    styles.options,
                    isOpen && styles.active,
                    position ? styles[position] : styles.bottom,
                    optionsClassName && optionsClassName,
                )}
            >
                {options.map((option) => (
                    <button
                        key={option.key}
                        className={clsx(styles.option, option.key === activeValue && styles.active)}
                        onClick={() => handleSelect(option.key)}
                        disabled={loading}
                    >
                        {option.label}
                        {activeValue === option.key && <MdCheck size={24} style={{ pointerEvents: 'none' }} />}
                    </button>
                ))}
            </ul>
        </div>
    )
}
