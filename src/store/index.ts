import { configureStore } from '@reduxjs/toolkit'
import userSlice from './reducers/user.reducer'

export const store = configureStore({
    reducer: userSlice,
})
