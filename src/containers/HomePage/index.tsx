import React, { useEffect, useState } from 'react'
import { getAnime } from '@/api/request'
import styles from './HomePage.module.sass'

interface Anime {
    title: string
    preview_image: string
    description: string
}

export const HomePage = () => {
    const [anime, setAnime] = useState<Anime[]>([])

    useEffect(() => {
        getAnime().then((resp) => console.log(resp))
    }, [])

    return <div>HomePage</div>
}
