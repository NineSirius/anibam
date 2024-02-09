'use client'
import { AnimeHomePage } from '@/containers/AnimeHomePage'
import { Suspense } from 'react'

const Anime = () => {
    return (
        <Suspense>
            <AnimeHomePage />
        </Suspense>
    )
}

export default Anime
