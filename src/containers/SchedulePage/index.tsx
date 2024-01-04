import React, { useEffect, useState } from 'react'
import styles from './SchedulePage.module.sass'
import { ScheduleT } from '../types/ScheduleT'
import { getAnilibriaSchedule, getAnilibriaTitle } from '@/api'
import ScrollContainer from 'react-indiana-drag-scroll'
import { TitleCard } from '@/components/TitleCard'
import { TitleT } from '../types/TitleT'

export const SchedulePage = () => {
    const [schedule, setSchedule] = useState<TitleT[][]>([])

    useEffect(() => {
        getAnilibriaSchedule().then((resp) => {
            const data = resp.data
            console.log(resp.data)
            //@ts-ignore
            const dataArr = Object.keys(data).map((key) => data[key])
            const titlesData = dataArr.map(async (dayItem) => {
                const day = dayItem.day
                const dayTitles = await dayItem.list.map(async (listItem: { code: string }) => {
                    const title = await getAnilibriaTitle(listItem.code)

                    if (title) {
                        return title
                    }
                })

                const parsedData = Promise.all(dayTitles)
                return parsedData
            })

            Promise.all(titlesData).then((resp) => setSchedule(resp))
        })
    }, [])

    const formatDay = (day: number) => {
        switch (day) {
            case 0:
                return 'Понедельник'
            case 1:
                return 'Вторник'
            case 2:
                return 'Среда'
            case 3:
                return 'Четверг'
            case 4:
                return 'Пятница'
            case 5:
                return 'Суббота'
            case 6:
                return 'Воскресенье'
            default:
                break
        }
    }

    return (
        <div className={`${styles.page} container`}>
            {schedule.map((schedule, index) => (
                <div key={index} className={styles.schedule_block}>
                    <h2 className={styles.title}>{formatDay(index)}</h2>
                    <ScrollContainer horizontal className={styles.scroll_container}>
                        {schedule.map((listItem) => (
                            <TitleCard
                                key={listItem.code}
                                name={listItem.names.ru}
                                poster={`https://anilibria.tv${listItem.posters.medium.url}`}
                                code={listItem.code}
                            />
                        ))}
                    </ScrollContainer>
                </div>
            ))}
        </div>
    )
}
