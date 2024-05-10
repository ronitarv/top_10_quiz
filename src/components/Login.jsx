import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = ({handle_login}) => {
  const navigate = useNavigate();
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    handle_login(username, password);
    set_username("");
    set_password("");
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>username: <input type="text" value={username} onChange={(event) => set_username(event.target.value)} /></div>
        <div>password: <input type="password" value={password} onChange={(event) => set_password(event.target.value)} /></div>
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default Login;