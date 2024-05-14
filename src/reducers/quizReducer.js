import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quizzes",
  initialState: [],
  reducers: {
    setQuizzes(state, action) {
      return action.payload;
    },
    createQuiz(state, action) {
      state.push({
        ...action.payload
      });
    },
    deleteQuiz(state, action) {
      return state.filter(quiz => quiz.id !== action.payload);
    }
  }
});

export const { setQuizzes, createQuiz, deleteQuiz } = quizSlice.actions;
export default quizSlice.reducer;