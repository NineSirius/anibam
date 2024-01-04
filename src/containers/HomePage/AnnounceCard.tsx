import React from 'react'
import styles from './HomePage.module.sass'
import { useRouter } from 'next/router'
import { TitleT } from '../types/TitleT'
import Image from 'next/image'

type AnnounceCardProps = {
    title: TitleT
    episodeStr: string
}

export const AnnounceCard: React.FC<AnnounceCardProps> = ({ title, episodeStr }) => {
    const router = useRouter()
    return (
        <div className={styles.announce_card} onClick={() => router.push(`/anime/${title.code}`)}>
            <div className={styles.poster}>
                <Image
                    src={`https://anilibria.tv${title.posters.small.url}`}
                    width={100}
                    height={100}
                    alt={`Постер к аниме ${title.names.ru}`}
                    className={styles.poster_img}
                />
            </div>
            <div className={styles.announce_card_info}>
                <h3 className={styles.title}>{title.names.ru}</h3>
                <h4 className={styles.subtitle}>{episodeStr}</h4>
            </div>
        </div>
    )
}
