import { WatchPost } from './../../containers/AnimeHome/index'
import { createSlice } from '@reduxjs/toolkit'
import Cookie from 'js-cookie'

export interface UserTypes {
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
    pending_list: WatchPost[]
    watch_list: WatchPost[]
}

export interface StoreTypes {
    user: UserTypes
    token: string
    authModal: boolean
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        token: null,
        authModal: false,
    },
    reducers: {
        addUserData: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        removeUserData: (state) => {
            state.user = null
            state.token = null
        },
        removePostponedAnime: (state, action) => {
            const user = state.user
            user.pending_list.splice(action.payload, 1)
            state.user = user
        },
        addPostponedAnime: (state, action) => {
            let user = state.user
            user.pending_list.push(action.payload)
            state.user = user
        },
        hideAuthModal: (state) => {
            state.authModal = false
        },
        showAuthModal: (state) => {
            state.authModal = true
        },
    },
})

export const {
    addUserData,
    removeUserData,
    removePostponedAnime,
    addPostponedAnime,
    hideAuthModal,
    showAuthModal,
} = userSlice.actions

export default userSlice.reducer
