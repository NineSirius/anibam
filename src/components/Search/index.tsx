import Image from 'next/image'
import React from 'react'
import styles from './Search.module.sass'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button } from '../UI/Button'
import { TextField } from '../UI/TextField'
import { Backdrop } from '../UI/Backdrop'
import { getTitleByName } from '@/api'
import clsx from 'clsx'
import { WatchItemInterface } from '@/containers/HomePage'

interface SearchProps {
    show: boolean
    onClose: () => void
}

export const Search: React.FC<SearchProps> = ({ show, onClose }) => {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<any[] | null>([])
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
            const resp = await getTitleByName(query)
            if (resp.data.length < 1) {
                setSearchResults(null)
            } else {
                setSearchResults(resp.data)
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

                {searchQuery && (
                    <ul className={styles.search_results}>
                        {searchResults ? (
                            searchResults.map((result: WatchItemInterface, index) => (
                                <li
                                    key={index}
                                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                                >
                                    <Button
                                        style={{ padding: 5, alignItems: 'flex-start' }}
                                        onClick={() =>
                                            router.push(`anime/${result.attributes.title_id}`)
                                        }
                                    >
                                        {result.attributes.poster && (
                                            <Image
                                                src={result.attributes.poster?.data.attributes.url}
                                                width={50}
                                                height={50}
                                                alt={result.attributes.poster?.data.attributes.name}
                                            />
                                        )}
                                        <div className={styles.result_info}>
                                            <h5>{result.attributes.title}</h5>
                                        </div>
                                    </Button>
                                </li>
                            ))
                        ) : (
                            <li>Ничего не найдено</li>
                        )}
                    </ul>
                )}
            </div>
            <Backdrop show={show} onClose={onClose} />
        </>
    )
}
