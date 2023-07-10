import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/user.reducer'
import globalSlice from './reducers/global.reducer'

export const store = configureStore({
    reducer: userSlice,
})
