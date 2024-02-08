import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IStreamInfo } from '~/interface/Channel';

// Define a type for the slice state
export interface StreamInfoState {
  streamInfo: IStreamInfo | null
}

// Define the initial state using that type
const initialState: StreamInfoState = {
  streamInfo: null
}

export const streamInfoSlice = createSlice({
  name: 'following',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStreamInfo: (state, action: PayloadAction<IStreamInfo>) => {
      state.streamInfo = action.payload
    },
  }
})

export const { setStreamInfo } = streamInfoSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectStreamInfo = (state: RootState) => state.streamInfo

export default streamInfoSlice.reducer