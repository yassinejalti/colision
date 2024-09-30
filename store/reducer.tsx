import { createSlice } from '@reduxjs/toolkit';

const generalSlice = createSlice({
  name: 'general',
  initialState: {
    general:{
      internal_client_ID: null,
      client: null,
      conversations: [],
    }
  },
  reducers: {
    open: (state, action) => {
      // this method is to set the initial connection needs
      state.general.internal_client_ID = (action.payload).internal_client_ID;
    },
    connect: (state, action) => {
      state.general.client = (action.payload).client;
      state.general.conversations = (action.payload).conversations;
    },
    msg: (state, action) => {
      state.general.conversations = (action.payload).conversations;
    },
    close: (state) => {
      state.general.internal_client_ID = null;
      state.general.client = null;
      state.general.conversations = [];
    },
  },
});

export const { open, connect, msg, close } = generalSlice.actions;

export default generalSlice.reducer;