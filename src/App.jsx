import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/SignUp";
import Quizzes from "./components/Quizzes";
import QuizCreate from "./components/QuizCreate";
import QuizUpdate from "./components/QuizUpdate";
import Sessions from "./components/Sessions";
import Session from "./components/Session";
import RoleSelect from "./components/RoleSelect";
import quizService from "./services/quizzes";
import { useState, useEffect, useRef } from "react";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { setQuizzes } from "./reducers/quizReducer";
import { setSessions } from "./reducers/sessionReducer";
import { setUser } from "./reducers/userReducer";
import { setRole } from "./reducers/roleReducer";
import { useDispatch, useSelector } from "react-redux";
import styles from "./css/App.module.css";
import { SlHome } from "react-icons/sl";
import { SlLogin } from "react-icons/sl";
import { SlLogout } from "react-icons/sl";
import { MdDeleteOutline } from "react-icons/md";
import { LuUserCircle2 } from "react-icons/lu";


const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);
  const [dropMenu, setDropMenu] = useState(false);
  const dialogRef = useRef();
  const [confirmText, setConfirmText] = useState("");

  const handleLogout = () => {
    dispatch(setUser(null));
    dispatch(setRole(null));
    window.localStorage.removeItem("top10QuizAppRole");
    quizService.setToken(null);
    window.localStorage.removeItem("top10QuizAppUser");
    navigate("/");
  };

  // window.onbeforeunload = () => {
  //   console.log("unload");
  //   handleLogout()
  // }

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
    const roleJson = window.localStorage.getItem("top10QuizAppRole");
    if (roleJson) {
      const role = JSON.parse(roleJson);
      dispatch(setRole(role));
    }
  }, []);

  useEffect(() => {
    const userJson = window.localStorage.getItem("top10QuizAppUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      quizService.tokenValid(user.token)
      .then(({isValid}) => {
        if (isValid) {
          dispatch(setUser(user));
          quizService.setToken(user.token);
        } else if (role === "host") {
          navigate("/signin")
        }
      })
    }
  }, [role])

  

  const cancelDeleteUser = () => {
    dialogRef.current?.close();
    setConfirmText("");
  }



  const deleteUser = () => {
    setConfirmText("");
    quizService.deleteUser(user.id).then(() => {
      handleLogout();
    })
  };

  if (!role) {
    return (
      <div style={{ "fontSize": "2.5rem" }}>
        <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/"><SlHome /></NavLink>
        <RoleSelect />
      </div>
    );
  }



  return (
    <div>
      <dialog id="dialog" className={styles.dialog} ref={dialogRef}>
        <h2>Delete user?</h2>
        <p>Enter the following to confirm you want to PERMANENTLY delete your user &quot;{user?.username}&quot;:<br/>&quot;sudo delete user {user?.username}&quot;</p>
        <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} />
        <div className={styles.buttons}>
          <button style={{ "backgroundColor": "#8388a4", "color": "black" }} onClick={cancelDeleteUser}>Cancel</button>
          <button style={{ backgroundColor: confirmText === `sudo delete user ${user?.username}` ? "#ed5e68" : "#eaeaea", color: "white" }} 
                  onClick={confirmText === `sudo delete user ${user?.username}` ? deleteUser : null}>
            Delete
          </button>
          </div>
      </dialog>
      <ReactNotifications />
      <div className={styles.navbar}>
        <div className={styles.options}>
          <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/"><SlHome /></NavLink>
          {role && <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/sessions">Sessions</NavLink>}
          {role === "host" && user && <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/quizzes">Quizzes</NavLink>}
        </div>
        {role === "host" && (role === "host" && user ?
          <div className={styles.user} onMouseLeave={() => setDropMenu(false)}>
            <div style={{ "fontSize": "3.5rem" }}><LuUserCircle2 onClick={() => setDropMenu(!dropMenu)} onMouseEnter={() => setDropMenu(true)}/></div>
            {dropMenu && <div className={styles.dropMenu}>

              <div>
                <div style={{ "textAlign": "center", "paddingTop": "5px" }}><em>{user.username}</em></div>
                <table className={styles.table}>
                  <tbody>
                    <tr><td><button className={styles.button} onClick={handleLogout}><SlLogout /> Logout</button></td></tr>
                    <tr><td><button className={styles.button} onClick={() => dialogRef.current?.showModal()}><MdDeleteOutline /> Delete user</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>}
          </div>
          : <NavLink className={({ isActive }) => isActive ? styles.activeOption : styles.option} to="/signin"><SlLogin /> sign in</NavLink>)
        }

      </div>
      {/* } */}
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        {role && <Route path="/sessions" element={<Sessions />} />}
        {role && <Route path="/sessions/:id" element={<Session />} />}
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
