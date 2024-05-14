import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: null,
  reducers: {
    setRole(state, action) {
      return action.payload;
    }
  }
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;