import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { IEmote } from '~/interface/chat';

// Define a type for the slice state
export interface EmoteState {
  emotes: IEmote[]
}

// Define the initial state using that type
const initialState: EmoteState = {
  emotes: []
}

export const emoteSlice = createSlice({
  name: 'emotes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addEmote: (state, action: PayloadAction<IEmote>) => {
      state.emotes.push(action.payload);
    },
  }
})

export const { addEmote } = emoteSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEmote = (state: RootState) => state.emotes

export default emoteSlice.reducer