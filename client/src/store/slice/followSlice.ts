import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Channel, ILiveFollowing } from '~/interface/Channel';
import { Stream } from 'stream';

// Define a type for the slice state
export interface FollowState {
  following: ILiveFollowing[]
}

// Define the initial state using that type
const initialState: FollowState = {
  following: []
}

export const followingSlice = createSlice({
  name: 'following',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addFollowingChannel: (state, action: PayloadAction<ILiveFollowing>) => {
      if (state.following.length == 0) {
        state.following.push(action.payload);
      }
    },
    addNewFollowingChannel: (state, action: PayloadAction<ILiveFollowing>) => {
      state.following.push(action.payload);
    }
  }
})

export const { addFollowingChannel, addNewFollowingChannel } = followingSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectChannel = (state: RootState) => state.following

export default followingSlice.reducer