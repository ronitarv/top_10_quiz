import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "sessions",
  initialState: [],
  reducers: {
    setSessions(state, action) {
      return action.payload;
    },
    createSession(state, action) {
      state.push({
        ...action.payload
      });
    },
    updateSession(state, action) {
      return state.map(session => session.id === action.payload.id ? action.payload : session);
    },
    deleteSession(state, action) {
      return state.filter(session => session.id !== action.payload);
    }
  }
});

export const { setSessions, createSession, updateSession, deleteSession } = sessionSlice.actions;
export default sessionSlice.reducer;