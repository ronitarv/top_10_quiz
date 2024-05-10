import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./components/Login";
import Quizzes from "./components/Quizzes";
import Sessions from "./components/Sessions";
import quiz_service from "./services/quizzes";
import {useState, useEffect} from "react";

const App = () => {

  const [user, set_user] = useState(null);

  useEffect(() => {
    const user_json = window.localStorage.getItem("top_10_quiz_app_user");
    if (user_json) {
      const user = JSON.parse(user_json);
      set_user(user);
      quiz_service.set_token(user.token);
    }
  }, []);

  const handle_login = async (username, password) => {
    const user = await quiz_service.login({username, password});
    if (user && user.token) {
      set_user(user);
      quiz_service.set_token(user.token);
      window.localStorage.setItem("top_10_quiz_app_user", JSON.stringify(user));
    }
  };

  const handle_logout = () => {
    set_user(null);
    quiz_service.set_token(null);
    window.localStorage.removeItem("top_10_quiz_app_user");
  };

  return (
    <Router>
      <div>
        <Link to="/">Sessions</Link>
        <Link to="/quizzes">Quizzes</Link>
        {user ? <span><em>{user.username} logged in</em> <button onClick={handle_logout}>logout</button></span> : <Link to="/login">Login</Link>}
      </div>
      <Routes>
        <Route path="/" element={<Sessions />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/login" element={<Login handle_login={handle_login}/>} />
      </Routes>
    </Router>
  );
};

export default App;
