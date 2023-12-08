import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './AnimeHomePage.module.sass'
import { TitlesDataT } from '../types/TitleT'
import { TitleCard } from '@/components/TitleCard'
import { getAnilibriaTitles } from '@/api'
import { Button } from '@/components/UI/Button'
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md'

export const AnimeHomePage = () => {
    const router = useRouter()
    const [width, setWidth] = useState<number>(0)
    const [titles, setTitles] = useState<TitlesDataT | null>(null)
    const [itemsPerPage, setItemsPerPage] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)

    useEffect(() => {
        const currentPage = router.query.page ? +router.query.page : 1
        getAnilibriaTitles(currentPage).then((resp) => {
            setTitles(resp)
            setItemsPerPage(resp.pagination.items_per_page)
            setTotalItems(resp.pagination.total_items)
            setTotalPages(Math.ceil(resp.pagination.total_items / resp.pagination.items_per_page))
            setCurrentPage(currentPage)
        })
    }, [router.query.page])

    useEffect(() => {
        console.log(window.screen.availWidth)
        setWidth(window.screen.availWidth)
    }, [])

    const handlePreviousPage = () => {
        const prevPage = Math.max(currentPage - 1, 1)
        router.push({ pathname: router.pathname, query: { page: prevPage } })
    }

    const handleNextPage = () => {
        const nextPage = Math.min(currentPage + 1, totalPages)
        router.push({ pathname: router.pathname, query: { page: nextPage } })
    }

    const handleFirstPage = () => {
        router.push({ pathname: router.pathname, query: { page: 1 } })
    }

    const handleLastPage = () => {
        router.push({ pathname: router.pathname, query: { page: totalPages } })
    }

    const renderPaginationButtons = () => {
        let buttonsToShow = 0

        if (width > 500) {
            buttonsToShow = 3
        } else {
            buttonsToShow = 1
        }

        let startPage = currentPage - buttonsToShow
        let endPage = currentPage + buttonsToShow

        if (startPage < 1) {
            endPage += Math.abs(startPage) + 1
            startPage = 1
        }

        if (endPage > totalPages) {
            startPage -= endPage - totalPages
            endPage = totalPages
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
            <Button
                key={page}
                className={page === currentPage ? styles.activePage : undefined}
                onClick={() => router.push({ pathname: router.pathname, query: { page } })}
            >
                {page}
            </Button>
        ))
    }

    if (titles) {
        return (
            <div className="container">
                <div className={styles.list}>
                    {titles.list.map((item) => (
                        <TitleCard
                            key={item.code}
                            name={item.names.ru}
                            code={item.code}
                            poster={`https://anilibria.tv${item.posters.small.url}`}
                        />
                    ))}
                </div>

                <div className={styles.pagination}>
                    <Button onClick={handlePreviousPage} disabled={currentPage === 1} color="primary">
                        <MdSkipPrevious size={24} />
                    </Button>
                    {currentPage > 4 && (
                        <>
                            <Button onClick={handleFirstPage} disabled={currentPage === 1}>
                                1
                            </Button>
                            <span>...</span>
                        </>
                    )}

                    {renderPaginationButtons()}
                    {currentPage < totalPages - 4 && (
                        <>
                            <span>...</span>
                            <Button onClick={handleLastPage} disabled={currentPage === totalPages}>
                                {totalPages}
                            </Button>
                        </>
                    )}
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages} color="primary">
                        <MdSkipNext size={24} />
                    </Button>
                </div>
            </div>
        )
    }
}
