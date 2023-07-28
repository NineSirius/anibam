import Image from 'next/image'
import React from 'react'
import styles from './Search.module.sass'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from '../UI/Button'
import { TextField } from '../UI/TextField'
import { Backdrop } from '../UI/Backdrop'
import { getAnilibriaTitleSearch, getTitleByName } from '@/api'
import clsx from 'clsx'
import { limitStr } from '../TitleCard'
import { format, parse, parseISO } from 'date-fns'
import { TitleT, TitlesDataT } from '@/containers/types/TitleT'

interface SearchProps {
    show: boolean
    onClose: () => void
}

export const Search: React.FC<SearchProps> = ({ show, onClose }) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<TitleT[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined)

    const router = useRouter()

    const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value
        setSearchQuery(query)
        clearTimeout(timeoutId)
        setLoading(false)

        if (query.length >= 1) {
            const newTimeoutId = setTimeout(() => {
                search(query)
            }, 1500)
            setTimeoutId(newTimeoutId)
        }
    }

    const search = async (query: string) => {
        setLoading(true)
        try {
            const resp = await getAnilibriaTitleSearch(query)
            if (resp.list.length < 1) {
                setSearchResults(null)
            } else {
                setSearchResults(resp.list)
            }
        } catch (error) {
            console.error('Ошибка при выполнении поиска:', error)
            setSearchResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className={clsx(styles.search, show && styles.active)}>
                <TextField
                    label="Введите запрос"
                    loading={loading}
                    id="search"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    autoFocus
                />

                <ul className={styles.search_results}>
                    {searchResults ? (
                        searchResults.map((result, index) => (
                            <li
                                key={index}
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    alignItems: 'flex-start',
                                }}
                            >
                                <Button
                                    style={{
                                        padding: 5,
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        paddingRight: 15,
                                        paddingLeft: 15,
                                        borderRadius: 0,
                                    }}
                                    onClick={() => {
                                        router.push(`/watch/${result.code}`)
                                        onClose()
                                    }}
                                >
                                    {result.posters && (
                                        <Image
                                            src={`https://anilibria.tv${result.posters.small.url}`}
                                            width={50}
                                            height={50}
                                            alt={`Постер к аниме ${result.names.ru}`}
                                        />
                                    )}
                                    <div className={styles.result_info}>
                                        <span>{result.status.string}</span>
                                        <h5>
                                            {result.names.ru.length >= 40
                                                ? limitStr(result.names.ru, 40)
                                                : result.names.ru}
                                        </h5>
                                        <p className={styles.caption}>{result.type.string}</p>
                                    </div>
                                </Button>
                            </li>
                        ))
                    ) : (
                        <li className={styles.nothing}>Ничего не найдено</li>
                    )}
                </ul>
            </div>
            <Backdrop show={show} onClose={onClose} />
        </>
    )
}
