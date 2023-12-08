export type UserT = {
    description: string
    id: number
    username: string
    email: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    online_status: boolean
    last_online: string
    role: {
        id: number
        name: string
        description: string
        type: string
        createdAt: string
        updatedAt: string
    }
    avatar: {
        id: number
        name: string
        width: number
        height: number
        url: string
        ext: '.gif' | '.png' | '.jpg'
    }
    user_config: {
        id: number
        username_styles: 'rgb' | 'default'
        show_vip_status: boolean
    }
    github_link: string | null
    telegram_link: string | null
    pending_list: TitleT[]
    watch_list: TitleT[]
}
