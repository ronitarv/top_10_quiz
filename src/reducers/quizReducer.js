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
    updateQuiz(state, action) {
      return state.map(quiz => quiz.id === action.payload.id ? action.payload : quiz);
    },
    deleteQuiz(state, action) {
      return state.filter(quiz => quiz.id !== action.payload);
    }
  }
});

export const { setQuizzes, createQuiz, updateQuiz, deleteQuiz } = quizSlice.actions;
export default quizSlice.reducer;