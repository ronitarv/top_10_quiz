import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quizService from "../services/quizzes";
import { Store } from "react-notifications-component";
import { errorNotification } from "../utils/helper";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";

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
      //Store.addNotification(successNotification("Signin", `Signed in as "${user.username}"`));
    } catch (error) {
      Store.addNotification(errorNotification("Signin", "Username or password is incorrect"));
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Sign in</h2>
      <form onSubmit={handleLogin}>
        <div>username: <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
        <div>password: <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <button type="submit">sign in</button>
      </form>
      <div><Link to="/signup">Create an account</Link></div>
    </div>
  );
};

export default Signin;