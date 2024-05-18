import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import quizReducer from "./reducers/quizReducer.js";
import sessionReducer from "./reducers/sessionReducer.js";
import userReducer from "./reducers/userReducer.js";
import roleReducer from "./reducers/roleReducer.js";
import "./index.css";

const store = configureStore({
  reducer: {
    quizzes: quizReducer,
    sessions: sessionReducer,
    user: userReducer,
    role: roleReducer
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
);
