import Image from 'next/image'
import styles from './Avatar.module.sass'

type AvatarProps = {
    username: string
    url?: string
    size?: {
        x?: number
        y?: number
    }
}

export const Avatar: React.FC<AvatarProps> = ({ username, url, size }) => {
    return (
        <div className={styles.avatar_wrap}>
            {url ? (
                <Image
                    src={url}
                    width={size && size.x ? size.x : 50}
                    height={size && size.y ? size.y : 50}
                    alt={`Аватарка пользователя ${username}`}
                    className={styles.avatar}
                />
            ) : (
                <div className={styles.default_avatar}>{username[0].toUpperCase()}</div>
            )}
        </div>
    )
}
