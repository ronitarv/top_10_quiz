import { useState } from "react";
import { useNavigate } from "react-router-dom";
import quizService from "../services/quizzes";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userReducer";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      //Store.addNotification(successNotification("Sign up", `Signed up as "${user.username}"`));
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
        //console.log(error);
        Store.addNotification(warningNotification("Sign up", error.response.data.error));
      });
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={onSignup}>
        <div>username: <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
        <div>password: <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        <button type="submit">sign up</button>
      </form>
    </div>
  );
};

export default Signup;