import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        authModal: false,
    },
    reducers: {
        hideAuthModal: (state) => {
            state.authModal = false
        },
        showAuthModal: (state) => {
            state.authModal = true
        },
    },
})

export const { showAuthModal, hideAuthModal } = globalSlice.actions

export default globalSlice.reducer
