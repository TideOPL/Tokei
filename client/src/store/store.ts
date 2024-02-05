import { configureStore } from '@reduxjs/toolkit'
import emoteReducer from './slice/emoteSlice'
import followReducer from './slice/followSlice'
import channelReducer from './slice/userSlice'

const store = configureStore({
  reducer: {
    emotes: emoteReducer,
    following: followReducer,
    channels: channelReducer
  }
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch