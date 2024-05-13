import {useState} from "react";
import {useNavigate} from "react-router-dom";
import quizService from "../services/quizzes";

const Login = ({handleLogin}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    handleLogin(username, password)
      .then((is_success) => {
        if (is_success) {
          navigate("/sessions");
        }
      });
    setUsername("");
    setPassword("");
  };

  const onSignup = () => {
    quizService.createUser({username, password})
      .then(() => {
        handleLogin(username, password);
        setUsername("");
        setPassword("");
      })
      .then(() => {
        navigate("/sessions");
      });
  };

  return (
    <div>
      <div>username: <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} /></div>
      <div>password: <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      <button onClick={onLogin}>login</button><button onClick={onSignup}>sign up</button>
    </div>
  );
};

export default Login;