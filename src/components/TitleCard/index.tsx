import Image from 'next/image'
import React from 'react'
import styles from './TitleCard.module.sass'
import { useRouter } from 'next/router'

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
}

export const TitleCard: React.FC<TitleCardProps> = ({ poster, title, titleId }) => {
    const router = useRouter()
    return (
        <div className={styles.card} onClick={() => router.push(`/anime/${titleId}`)}>
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
            <h2>{title}</h2>
        </div>
    )
}
