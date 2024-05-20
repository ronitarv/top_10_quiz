import { Routes, Route, useNavigate, useLocation, NavLink } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/SignUp";
import Quizzes from "./components/Quizzes";
import QuizCreate from "./components/QuizCreate";
import QuizUpdate from "./components/QuizUpdate";
import Sessions from "./components/Sessions";
import Session from "./components/Session";
import RoleSelect from "./components/RoleSelect";
import quizService from "./services/quizzes";
import { useEffect } from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
//import "./css/Notification.css";
//import { Store } from "react-notifications-component";
import { setQuizzes } from "./reducers/quizReducer";
import { setSessions, deleteSession } from "./reducers/sessionReducer";
import { setUser } from "./reducers/userReducer";
import { setRole } from "./reducers/roleReducer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./css/App.module.css";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location.pathname);
  //const quizzes = useSelector(state => state.quizzes);
  //const sessions = useSelector(state => state.sessions);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);

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
    //Store.addNotification(successNotification("Logout", `Logged out from "${user.username}"`));
    dispatch(setUser(null));
    dispatch(setRole(null));
    window.localStorage.removeItem("top10QuizAppRole");
    quizService.setToken(null);
    window.localStorage.removeItem("top10QuizAppUser");
    navigate("/");
  };

  const removeSession = (session) => {
    if (window.confirm(`Are you sure you want to remove the session: ${session.name}`)) {
      quizService.deleteSession(session.id).then(() => {
        //Store.addNotification(successNotification("Session", `Deleted session "${session.name}"`));
        dispatch(deleteSession(session.id));
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
      {/* {location.pathname !== "/" && */}
      <div className={styles.navbar}>
        <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/" activeClassName={styles.active}>Start</NavLink>
        <ul className={styles.options}>
          {role && <li><NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/sessions">Sessions</NavLink></li>}
          {role === "host" && user && <li><NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/quizzes">Quizzes</NavLink></li>}
          {role === "host" &&
            <li>
              <label>User</label>
              <ul className={styles.dropMenu}>
                {role === "host" && (user ? <li><div><em>{user.username} logged in</em></div> <div><button onClick={handleLogout}>logout</button></div></li> : <li><NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/signin">sign in</NavLink></li>)}
                {role === "host" && user && <li><button onClick={deleteUser}>Delete user</button></li>}
              </ul>
            </li>
          }
        </ul>
      </div>
      {/* } */}
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        {role && <Route path="/sessions" element={<Sessions removeSession={removeSession}/>} />}
        {role && <Route path="/sessions/:id" element={<Session removeSession={removeSession}/>} />}
        {role === "host" && user && <Route path="/quizzes" element={<Quizzes/>} />}
        {role === "host" && user && <Route path="/quizzes/create" element={<QuizCreate/>} />}
        {role === "host" && user && <Route path="/quizzes/update/:id" element={<QuizUpdate/>} />}
        {role === "host" && <Route path="/signin" element={<Signin/>} />}
        {role === "host" && <Route path="/signup" element={<Signup/>} />}
      </Routes>
    </div>
  );
};

export default App;
