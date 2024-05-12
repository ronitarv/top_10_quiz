import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Login from "./components/Login";
import Quizzes from "./components/Quizzes";
import QuizCreate from "./components/QuizCreate";
import Sessions from "./components/Sessions";
import Session from "./components/Session";
import quiz_service from "./services/quizzes";
import {useState, useEffect} from "react";

const App = () => {

  const [user, set_user] = useState(null);
  const [sessions, set_sessions] = useState([]);
  const [quizzes, set_quizzes] = useState([]);

  useEffect(() => {
    quiz_service.get_quizzes()
      .then(quizzes => {
        set_quizzes(quizzes);
      });
  }, [user]);

  useEffect(() => {
    quiz_service.get_sessions()
      .then(sessions => {
        set_sessions(sessions);
      });
  }, [user]);

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
        <Route path="/" element={<Sessions sessions={sessions} set_sessions={set_sessions}/>} />
        <Route path="/sessions/:id" element={<Session quizzes={quizzes} user={user}/>} />
        <Route path="/quizzes" element={<Quizzes quizzes={quizzes}/>} />
        <Route path="/quizzes/create" element={<QuizCreate quizzes={quizzes} set_quizzes={set_quizzes}/>} />
        <Route path="/login" element={<Login handle_login={handle_login}/>} />
      </Routes>
    </Router>
  );
};

export default App;
