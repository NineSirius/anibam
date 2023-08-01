import Image from 'next/image'
import React, { useState } from 'react'
import styles from './TitleCard.module.sass'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { MdClose, MdInfo } from 'react-icons/md'

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
    const [hoverInfoShow, setHoverInfoShow] = useState<boolean>(false)
    const router = useRouter()
    const showHoverInfo = () => setHoverInfoShow(true)
    const hideHoverInfo = () => setHoverInfoShow(false)
    const toggleHoverInfo = () => setHoverInfoShow(!hoverInfoShow)
    return (
        <div
            className={clsx(styles.card, className && className)}
            onClick={(event) => {
                event.stopPropagation()
                router.push(`/anime/${code}`)
            }}
        >
            <div
                className={clsx(styles.poster_wrap, hoverInfoShow && styles.active)}
                onMouseEnter={showHoverInfo}
                onMouseLeave={hideHoverInfo}
            >
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
                <button className={styles.info_btn} onClick={toggleHoverInfo}>
                    {hoverInfoShow ? (
                        <MdClose style={{ color: 'var(--btn-primary-bg)' }} size={24} />
                    ) : (
                        <MdInfo style={{ color: 'var(--btn-primary-bg)' }} size={24} />
                    )}
                </button>
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
