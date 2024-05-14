import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/SignUp";
import Quizzes from "./components/Quizzes";
import QuizCreate from "./components/QuizCreate";
import Sessions from "./components/Sessions";
import Session from "./components/Session";
import RoleSelect from "./components/RoleSelect";
import quizService from "./services/quizzes";
import { useState, useEffect } from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
//import "./css/Notification.css";
import { errorNotification, successNotification } from "./utils/helper";
import { Store } from "react-notifications-component";
import { setQuizzes, createQuiz } from "./reducers/quizReducer";
import { setSessions, createSession } from "./reducers/sessionReducer";
import { setUser } from "./reducers/userReducer";
import { setRole } from "./reducers/roleReducer";
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const quizzes = useSelector(state => state.quizzes);
  const sessions = useSelector(state => state.sessions);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);

  // Store.addNotification({
  //   title: "Wonderful!",
  //   message: "teodosii@react-notifications-component",
  //   type: "success",
  //   insert: "top",
  //   container: "top-right",
  //   animationIn: ["animate__animated", "animate__fadeIn"],
  //   animationOut: ["animate__animated", "animate__fadeOut"],
  //   dismiss: {
  //     duration: 5000,
  //     onScreen: true
  //   }
  // });

  useEffect(() => {
    quizService.getQuizzes()
      .then(quizzes => {
        dispatch(setQuizzes(quizzes));
      });
  }, [user]);

  useEffect(() => {
    quizService.getSessions()
      .then(sessions => {
        dispatch(setSessions(sessions));
      });
  }, [user]);

  useEffect(() => {
    const userJson = window.localStorage.getItem("top10QuizAppUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      dispatch(setUser(user));
      quizService.setToken(user.token);
    }
    const roleJson = window.localStorage.getItem("top10QuizAppRole");
    if (roleJson) {
      const role = JSON.parse(roleJson);
      dispatch(setRole(role));
    }
  }, []);



  const handleLogout = () => {
    Store.addNotification(successNotification("Logout", `Logged out from "${user.username}"`));
    dispatch(setUser(null));
    quizService.setToken(null);
    window.localStorage.removeItem("top10QuizAppUser");
    navigate("/");
  };

  const deleteSession = (session) => {
    if (window.confirm(`Are you sure you want to remove the session: ${session.name}`)) {
      quizService.deleteSession(session.id).then(() => {
        Store.addNotification(successNotification("Session", `Deleted session "${session.name}"`));
        dispatch(setSessions(sessions.filter(s => s.id !== session.id)));
      });
      return true;
    }
  };

  const deleteUser = () => {
    if (window.confirm(`Are you sure you want to PERMANENTLY remove your user: ${user.username}`)) {
      quizService.deleteUser(user.id).then(() => {
        handleLogout();
      });
    }
  };

  if (!role) {
    return (
      <RoleSelect />
    );
  }

  return (
    <div>
      <ReactNotifications />
      <div>
        <Link to="/">Start</Link>
        <Link to="/sessions">Sessions</Link>
        {role === "host" && user && <Link to="/quizzes">Quizzes</Link>}
        {role === "host" && (user ? <span><em>{user.username} logged in</em> <button onClick={handleLogout}>logout</button></span> : <Link to="/signin">sign in</Link>)}
        {role === "host" && user && <button onClick={deleteUser}>Delete user</button>}
      </div>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/sessions" element={<Sessions deleteSession={deleteSession}/>} />
        <Route path="/sessions/:id" element={<Session deleteSession={deleteSession}/>} />
        {role === "host" && user && <Route path="/quizzes" element={<Quizzes/>} />}
        {role === "host" && user && <Route path="/quizzes/create" element={<QuizCreate/>} />}
        {role === "host" && <Route path="/signin" element={<Signin/>} />}
        {role === "host" && <Route path="/signup" element={<Signup/>} />}
      </Routes>
    </div>
  );
};

export default App;
