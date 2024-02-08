import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Channel } from '~/interface/Channel';

// Define a type for the slice state
export interface ChannelState {
  channels: Channel[]
}

// Define the initial state using that type
const initialState: ChannelState = {
  channels: []
}

export const channelSlice = createSlice({
  name: 'channels',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<Channel>) => {
      state.channels.push(action.payload);
    },
  }
})

export const { addChannel } = channelSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectChannel = (state: RootState) => state.channels

export default channelSlice.reducer