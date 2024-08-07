import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quizService from "../services/quizzes";
import { Store } from "react-notifications-component";
import { errorNotification } from "../utils/helper";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";
import styles from "../css/Signin.module.css";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await quizService.login({ username, password });
      if (user && user.token) {
        dispatch(setUser(user));
        quizService.setToken(user.token);
        window.localStorage.setItem("top10QuizAppUser", JSON.stringify(user));
      }
      navigate("/sessions");
    } catch (error) {
      Store.addNotification(errorNotification("Sign in", "Username or password is incorrect"));
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className={styles.body}>
      <h2>Sign in</h2>
      <div className={styles.container}>
        <form onSubmit={handleLogin}>
          <div><input type="text" placeholder="username" value={username} maxLength={20} onChange={(event) => setUsername(event.target.value)} /></div>
          <div><input type="password" placeholder="password" value={password} maxLength={40} onChange={(event) => setPassword(event.target.value)} /></div>
          <button type="submit">sign in</button>
        </form>
        <div style={{ "paddingTop": "2rem", "fontSize": "2.5rem", "textDecoration": "none" }}>No account? <Link style={{ "textDecoration": "none", color: "#0000FF" }}to="/signup">Sign up</Link></div>
      </div>
    </div>
  );
};

export default Signin;