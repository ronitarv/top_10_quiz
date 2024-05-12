import {useState} from "react";
import {useNavigate} from "react-router-dom";
import quiz_service from "../services/quizzes";

const Login = ({handle_login}) => {
  const navigate = useNavigate();
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");

  const on_login = () => {
    handle_login(username, password);
    set_username("");
    set_password("");
    navigate("/");
  };

  const on_sign_up = () => {
    quiz_service.create_user({username, password})
      .then(() => {
        handle_login(username, password);
        set_username("");
        set_password("");
      })
      .then(() => {
        navigate("/");
      });
  };

  return (
    <div>
      <div>username: <input type="text" value={username} onChange={(event) => set_username(event.target.value)} /></div>
      <div>password: <input type="password" value={password} onChange={(event) => set_password(event.target.value)} /></div>
      <button onClick={on_login}>login</button><button onClick={on_sign_up}>sign up</button>
    </div>
  );
};

export default Login;