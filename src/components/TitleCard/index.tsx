import Image from 'next/image'
import React, { useRef, useState } from 'react'
import styles from './TitleCard.module.sass'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { MdClose, MdInfo } from 'react-icons/md'
import { useEffect } from 'react'

interface TitleCardProps {
    poster: string
    name: string
    code: string
    className?: any
}

export function limitStr(str: string, n: number, symb?: string) {
    if (!n && !symb) return str
    symb = symb || '...'
    return str.substr(0, n - symb.length) + symb
}

export const TitleCard: React.FC<TitleCardProps> = ({ poster, name, code, className }) => {
    const router = useRouter()

    return (
        <div className={clsx(styles.card, className && className)} onClick={() => router.push(`/anime/${code}`)}>
            <Image
                src={poster}
                width={200}
                height={400}
                alt={`Постер к аниме ${name}`}
                className={styles.poster}
                draggable={false}
            />

            <h2 title={name}>{name.length > 30 ? limitStr(name, 36, '...') : name}</h2>
        </div>
    )
}
