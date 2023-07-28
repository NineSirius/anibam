export type TitlesDataT = {
    list: TitlesT
    pagination: any[]
}

export type TitlesT = Array<TitleT>

export type TitleT = {
    franchises: any
    id: number
    code: string
    names: namesT
    posters: postersT
    updated: number
    last_change: number
    status: statusT
    type: typeT
    genres: Array<string>
    team: teamT
    season: seasonT
    year: number
    week_day: number
    description: string
    blocked: blockedT
    player: playerT
    torrents: torrentsT
}

export type namesT = {
    ru: string
    en: string
    alternative: string
}

export type postersT = {
    small: posterT
    medium: posterT
    original: posterT
}

export type posterT = {
    url: string
    raw_base64_file: string
}

export type statusT = {
    string: string
    code: number //1 – В работе 2 – Завершен 3 – Скрыт 4 – Неонгоинг
}

export type typeT = {
    full_string: string
    string: string
    episodes: number
    length: string
    code: number // 0– Фильм 1 – TV 2 – OVA 3 – ONA 4 – Спешл 5 – WEB 6 – Дорама 7 – OAD
}

export type teamT = {
    voice: Array<string>
    translator: Array<string>
    editing: Array<string>
    decor: Array<string>
    timing: Array<string>
}

export type seasonT = {
    year: number
    week_day: number //Счет дней недели идет с понедельника, где 0 - Понедельник, а 6 - Воскресенье.
    string: string
    code: number // 1 - Зима, 2 - Весна, 3 - Лето, 4 - Осень
}

export type blockedT = {
    blocked: boolean
    bakanim: boolean
}

export type playerT = {
    alternative_player: string
    host: string
    list: Array<playerListT>
    episodes: episodesT
    rutube: Array<rutubeT>
}
export type rutubeT = {
    created_timestamp: number
    episode: number
    rutube_id: string
}

export type torrentsT = {
    episodes: episodesT
    list: Array<torrentListT>
}

export type hostT = {
    hls: string
}

export type playerListT = {
    episode: number
    name: string
    uuid: string
    created_timestamp: number
    preview: string
    skips: skipsT
    hls: hlsT
}

export type episodesT = {
    string: string
    first: number
    last: number
}

export type skipsT = {
    opening: Array<number>
    ending: Array<number>
}

export type hlsT = {
    fhd: string
    hd: string
    sd: string
}

export type torrentListT = {
    torrent_id: number
    episodes: episodesT
    quality: qualityT
    leechers: number
    seeders: number
    downloads: number
    total_size: number
    size_string: string
    url: string
    uploaded_timestamp: number
    raw_base64_file: string
    metadata: metadataT
    hash: string
}

export type qualityT = {
    string: string
    type: string
    resolution: number
    encoder: string
    lq_audio: boolean
}
export type metadataT = {
    hash: string
    name: string
    announce: Array<string>
    created_timestamp: number
    files_list: Array<files_listT>
}

export type files_listT = {
    file: string
    size: number
    offset: number
}

export type description_typeT = {
    length: number
    html: string //html – Описание тайтла в виде html (в том виде в каком оно на сайте)
    plain: string // plain – Описание тайтла в виде текста без дополнительного форматирования
    no_view_order: string //no_view_order – Описание тайтла в виде текста без дополнительного форматирования и порядка просмотра
}
