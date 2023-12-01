import { configureStore } from '@reduxjs/toolkit'
import projectSlice from './projectSlice'

const store =  configureStore({
  reducer: {
    project: projectSlice
  }
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch