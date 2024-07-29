import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../services/quizzes";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";
import styles from "../css/Signin.module.css";
import { BiSolidShow } from "react-icons/bi";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const user = await quizService.login({ username, password });
      if (user && user.token) {
        dispatch(setUser(user));
        quizService.setToken(user.token);
        window.localStorage.setItem("top10QuizAppUser", JSON.stringify(user));
      }
      navigate("/sessions");
      setUsername("");
      setPassword("");
    } catch (error) {
      Store.addNotification(errorNotification("Sign up", "Signing in to created user failed"));
    }
  };

  const onSignup = (event) => {
    event.preventDefault();
    quizService.createUser({ username, password })
      .then(() => {
        handleLogin(username, password);
      })
      .catch((error) => {
        Store.addNotification(warningNotification("Sign up", error.response.data.error));
      });
  };

  return (
    <div className={styles.body}>
      <h2>Sign up</h2>
      <div className={styles.container}>
        <form onSubmit={onSignup}>
          <div><input type="text" placeholder="username" value={username} maxLength={20} onChange={(event) => setUsername(event.target.value)} /></div>
          <div style={{ "verticalAlign": "middle" }}><input type={passwordVisible ? "text" : "password"} placeholder="password" value={password} maxLength={40} onChange={(event) => setPassword(event.target.value)} /><BiSolidShow style={{ "fontSize": "50px", "position": "relative", "marginLeft":  "-50px", "top": "21px", "left": "-20px", "zIndex": "2" }} onClick={() => setPasswordVisible(!passwordVisible)} /></div>
          <button style={{ "marginBottom": "20px" }}type="submit">sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;