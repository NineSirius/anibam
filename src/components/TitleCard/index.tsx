import Image from 'next/image'
import React from 'react'
import styles from './TitleCard.module.sass'
import { useRouter } from 'next/router'
import clsx from 'clsx'

interface TitleCardProps {
    poster: string
    name: string
    code: string
    description: string
    className?: any
    episodesCount: number
}

export function limitStr(str: string, n: number, symb?: string) {
    if (!n && !symb) return str
    symb = symb || '...'
    return str.substr(0, n - symb.length) + symb
}

export const TitleCard: React.FC<TitleCardProps> = ({
    poster,
    name,
    code,
    description,
    className,
    episodesCount,
}) => {
    const router = useRouter()
    return (
        <div
            className={clsx(styles.card, className && className)}
            onClick={() => router.push(`/anime/${code}`)}
        >
            <div className={styles.poster_wrap}>
                {poster && (
                    <Image
                        src={poster}
                        width={200}
                        height={400}
                        alt={`Постер к аниме ${name}`}
                        className={styles.poster}
                        draggable={false}
                    />
                )}
                <div className={styles.poster_info}>
                    <div className={styles.poster_info_content}>
                        <span>{episodesCount} эп.</span>
                    </div>
                    <p>{description && limitStr(description, 80)}</p>
                </div>
            </div>
            <h2 title={name}>{name.length > 30 ? limitStr(name, 36, '...') : name}</h2>
        </div>
    )
}
