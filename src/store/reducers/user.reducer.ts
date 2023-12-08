import { TitleT } from '@/containers/types/TitleT'
import { UserT } from '@/containers/types/UserT'
import { createSlice } from '@reduxjs/toolkit'

export interface StoreTypes {
    user: UserT
    token: string
    authModal: boolean
    theme: 'dark' | 'light'
    lightgallery: any[]
    loading: boolean
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null as UserT | null,
        token: null,
        authModal: false,
        theme: 'light',
        lightgallery: [],
        loading: false,
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
            if (state.user) {
                const user = state.user
                user.pending_list.splice(action.payload, 1)
                state.user = user
            }
        },
        addPostponedAnime: (state, action) => {
            if (state.user) {
                let user = state.user
                user.pending_list.push(action.payload)
                state.user = user
            }
        },
        hideAuthModal: (state) => {
            state.authModal = false
        },
        showAuthModal: (state) => {
            state.authModal = true
        },
        setLightTheme: (state) => {
            state.theme = 'light'
        },
        setDarkTheme: (state) => {
            state.theme = 'dark'
        },
        addToLightGallery: (state, action) => {
            state.lightgallery = action.payload
        },
        removeFromLightGallery: (state) => {
            state.lightgallery = []
        },
        turnOnLoading: (state) => {
            state.loading = true
        },
        turnOffLoading: (state) => {
            state.loading = false
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
    setLightTheme,
    setDarkTheme,
    addToLightGallery,
    removeFromLightGallery,
    turnOnLoading,
    turnOffLoading,
} = userSlice.actions

export default userSlice.reducer
