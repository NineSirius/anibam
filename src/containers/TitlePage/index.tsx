import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { WatchItemInterface } from '../HomePage'
import styles from './TitlePage.module.sass'
import Image from 'next/image'

interface TitlePageProps {
    data: WatchItemInterface
}

export const TitlePage: React.FC<TitlePageProps> = ({ data }) => {
    const [titleInfo, setTitleInfo] = useState<WatchItemInterface>()

    useEffect(() => {
        if (data) {
            setTitleInfo(data.data[0])
        }
    }, [data])

    if (titleInfo) {
        return (
            <>
                <Head>
                    <title>{`${titleInfo.attributes.title} - смотреть на AniBam`}</title>
                </Head>
                <div className="container">
                    <div className={styles.title_info}>
                        {titleInfo.attributes.poster && (
                            <Image
                                src={titleInfo.attributes.poster?.data.attributes.url}
                                width={titleInfo.attributes.poster?.data.attributes.width}
                                height={
                                    titleInfo.attributes.poster?.data.attributes.height
                                }
                                alt={titleInfo.attributes.poster?.data.attributes.name}
                                className={styles.poster}
                            />
                        )}

                        <div className={styles.title_info_content}>
                            <h1>{titleInfo.attributes.title}</h1>
                            <p className="caption">
                                {titleInfo.attributes.original_title}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
