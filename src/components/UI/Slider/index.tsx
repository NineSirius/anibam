import React, { CSSProperties, useEffect, useState } from 'react'
import styles from './Slider.module.sass'
import clsx from 'clsx'
import format from 'date-fns/format'

type SliderProps = {
    id: string
    max: number
    min?: number
    value: number
    onChange: (value: number) => void
    onAfterChange?: (value: number) => void
    thumbBackground?: string
    thumbStyle?: CSSProperties
    fillBackground?: string
    fillStyle?: CSSProperties
    fillContaienrBackground?: string
    fillContainerStyle?: CSSProperties
    className?: string
    isTooltip?: boolean
    formatTime?: (time: number) => string
    loaded?: number
}

export const Slider: React.FC<SliderProps> = ({
    id,
    max,
    min,
    value,
    onChange,
    onAfterChange,
    thumbBackground,
    thumbStyle,
    fillBackground,
    fillStyle,
    fillContaienrBackground,
    fillContainerStyle,
    className,
    isTooltip,
    formatTime,
    loaded,
}): JSX.Element => {
    // const [cursorPosition, setCursosPosition] = useState<number>(0)
    // const [time, setTime] = useState<number | null>(null)

    // useEffect(() => {
    //     return window.addEventListener('mousemove', (e) => {
    //         const slider = document.getElementById(id)
    //         if (slider && isTooltip) {
    //             const rect = slider.getBoundingClientRect()
    //             const left = e.clientX - rect.left
    //             const totalWidth = rect.width
    //             const percentage = left / totalWidth

    //             const vidTime = max * percentage

    //             if (left <= totalWidth && left >= 0) {
    //                 setCursosPosition(left)
    //                 setTime(vidTime)
    //             }
    //         }
    //     })
    // }, [id, isTooltip, max])

    return (
        <div className={clsx(styles.slider, className)} id={id}>
            <div
                className={styles.fill_container}
                style={{ ...fillContainerStyle, background: fillContaienrBackground }}
            >
                <span
                    className={styles.fill}
                    style={{ width: `${(value / max) * 100}%`, ...fillStyle, background: fillBackground }}
                ></span>
                {loaded && <span className={styles.loadedFill} style={{ width: `${(loaded / max) * 100}%` }}></span>}
            </div>
            {/* {isTooltip && (
                <span className={styles.tooltip} style={{ left: cursorPosition }}>
                    {time && formatTime ? formatTime(time) : '00:00'}
                </span>
            )} */}
            <input
                type="range"
                max={max}
                min={min}
                step={1}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    onChange(+e.target.value)
                    if (onAfterChange) {
                        onAfterChange(+e.target.value)
                    }
                }}
                className={styles.input}
            />
        </div>
    )
}
