import React, { useState } from 'react'
import styles from './SavedTitleCard.module.sass'
import { TitleT } from '@/containers/types/TitleT'
import Image from 'next/image'
import { formatPlayerTime } from '../VideoPlayer'
import { limitStr } from '../TitleCard'

export type SavedTitleCardProps = {
    title: string
    poster: string
    playedInfo: {
        e: number
        t: number
        epTime: number
    }
    onClick: () => void
}

export const SavedTitleCard: React.FC<SavedTitleCardProps> = ({ title, poster, playedInfo, onClick }) => {
    const [seekTimeWidth, setSeekTimeWidth] = useState<number>((playedInfo.t * 100) / playedInfo.epTime)

    return (
        <div className={styles.card} onClick={onClick}>
            <Image
                src={poster}
                width={200}
                height={285}
                alt={`Постер к аниме ${title}`}
                className={styles.poster}
                draggable={false}
            />
            <div className={styles.info}>
                <div className={styles.titleInfo}>
                    <h4>{limitStr(title, 40)}</h4>
                </div>
                <div className={styles.playerInfo}>
                    <p>
                        {playedInfo.e} серия / {formatPlayerTime(playedInfo.t)} - {formatPlayerTime(playedInfo.epTime)}
                    </p>
                    <div className={styles.seek}>
                        <span className={styles.seekTime} style={{ width: `${seekTimeWidth}%` }}></span>
                    </div>
                </div>
            </div>
        </div>
    )
}
