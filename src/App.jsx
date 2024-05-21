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
import { SlUser } from "react-icons/sl";
import { SlHome } from "react-icons/sl";
import { SlLogin } from "react-icons/sl";
import { SlLogout } from "react-icons/sl";
import { MdDeleteOutline } from "react-icons/md";



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
      <div>
        <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/">Start</NavLink>
        <RoleSelect />
      </div>
    );
  }

  return (
    <div>
      <ReactNotifications />
      {/* {location.pathname !== "/" && */}
      <div className={styles.navbar}>
        <div className={styles.options}>
          <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/"><SlHome /></NavLink>
          {role && <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/sessions">Sessions</NavLink>}
          {role === "host" && user && <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/quizzes">Quizzes</NavLink>}
        </div>
        {role === "host" && user ?
          <div className={styles.user}>
            {/* // <li> */}
            <div><SlUser /><label style={{ "paddingLeft": "10px" }}>User</label></div>
            <div className={styles.dropMenu}>

              <div>
                <div style={{ "textAlign": "center", "paddingTop": "5px" }}><em>{user.username}</em></div>
                <table className={styles.table}>
                  <tbody>
                    <tr><td><button className={styles.button} onClick={handleLogout}><SlLogout /> Logout</button></td></tr>
                    <tr><td><button className={styles.button} onClick={deleteUser}><MdDeleteOutline /> Delete user</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          : <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/signin"><SlLogin /> sign in</NavLink>
        }

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
