import Image from 'next/image'
import React from 'react'
import styles from './TitleCard.module.sass'
import { useRouter } from 'next/router'
import clsx from 'clsx'

interface TitleCardProps {
    poster?: {
        name: string
        alternativeText: string | null
        caption: string | null
        width: number
        height: number
        url: string
        formats: {
            thumbnail?: {
                name: string
                hash: string
                ext: '.jpg' | '.png'
                mime: 'image/jpeg' | 'image/png'
                path: string | null
                width: number
                height: number
                size: number
                url: string
                provider_metadata?: {
                    public_id: string
                    resource_type: 'image'
                }
            }
            small?: {
                name: string
                hash: string
                ext: '.jpg' | '.png'
                mime: 'image/jpeg' | 'image/png'
                path: string | null
                width: number
                height: number
                size: number
                url: string
                provider_metadata?: {
                    public_id: string
                    resource_type: 'image'
                }
            }
        }
    }
    title: string
    titleId: string
    description: string
    className?: any
    type: 'Аниме' | 'Фильм' | 'Мультсериал' | 'Мультфильм' | 'Сериал'
}

export function limitStr(str: string, n: number, symb?: string) {
    if (!n && !symb) return str
    symb = symb || '...'
    return str.substr(0, n - symb.length) + symb
}

export const TitleCard: React.FC<TitleCardProps> = ({
    poster,
    title,
    titleId,
    description,
    className,
    type,
}) => {
    const router = useRouter()
    return (
        <div
            className={clsx(styles.card, className && className)}
            onClick={() =>
                router.push(
                    `/${type === 'Аниме' ? 'anime' : type === 'Фильм' ? 'films' : null}/${titleId}`,
                )
            }
        >
            <div className={styles.poster_wrap}>
                {poster && (
                    <Image
                        src={poster.url}
                        width={poster.width}
                        height={poster.height}
                        alt={poster.name}
                        className={styles.poster}
                        draggable={false}
                    />
                )}
                <div className={styles.poster_info}>
                    <p>{limitStr(description, 80)}</p>
                </div>
            </div>
            <h2>{limitStr(title, 48, '...')}</h2>
        </div>
    )
}
