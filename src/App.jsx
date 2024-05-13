import {Routes, Route, Link} from "react-router-dom";
import SignIn from "./components/SignIn";
import Quizzes from "./components/Quizzes";
import QuizCreate from "./components/QuizCreate";
import Sessions from "./components/Sessions";
import Session from "./components/Session";
import RoleSelect from "./components/RoleSelect";
import quizService from "./services/quizzes";
import {useState, useEffect} from "react";
import {ReactNotifications} from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
//import "./css/Notification.css";
import {errorNotification, successNotification} from "./utils/helper";
import {Store} from "react-notifications-component";

const App = () => {

  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [role, setRole] = useState(null);

  // Store.addNotification({
  //   title: "Wonderful!",
  //   message: "teodosii@react-notifications-component",
  //   type: "success",
  //   insert: "top",
  //   container: "top-right",
  //   animationIn: ["animate__animated", "animate__fadeIn"],
  //   animationOut: ["animate__animated", "animate__fadeOut"],
  //   dismiss: {
  //     duration: 5000,
  //     onScreen: true
  //   }
  // });

  useEffect(() => {
    quizService.getQuizzes()
      .then(quizzes => {
        setQuizzes(quizzes);
      });
  }, [user]);

  useEffect(() => {
    quizService.getSessions()
      .then(sessions => {
        setSessions(sessions);
      });
  }, [user]);

  const handleSetRole = (role) => {
    setRole(role);
    window.localStorage.setItem("top10QuizAppRole", JSON.stringify(role));
  };

  useEffect(() => {
    const userJson = window.localStorage.getItem("top10QuizAppUser");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUser(user);
      quizService.setToken(user.token);
    }
    const roleJson = window.localStorage.getItem("top10QuizAppRole");
    if (roleJson) {
      const role = JSON.parse(roleJson);
      setRole(role);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await quizService.login({username, password});
      if (user && user.token) {
        setUser(user);
        quizService.setToken(user.token);
        window.localStorage.setItem("top10QuizAppUser", JSON.stringify(user));
      }
      return true;
    } catch (error) {
      Store.addNotification(errorNotification("Login", "Wrong credentials"));
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    quizService.setToken(null);
    window.localStorage.removeItem("top10QuizAppUser");
  };

  const deleteSession = (session) => {
    if (window.confirm(`Are you sure you want to remove the session: ${session.name}`)) {
      quizService.deleteSession(session.id).then(() => {
        setSessions(sessions.filter(s => s.id !== session.id));
      });
      return true;
    }
  };

  const deleteQuiz = (quiz) => {
    if (window.confirm(`Are you sure you want to remove the quiz: ${quiz.question}`)) {
      quizService.deleteQuiz(quiz.id).then(() => {
        setQuizzes(quizzes.filter(q => q.id !== quiz.id));
      });
    }
  };

  const deleteUser = () => {
    if (window.confirm(`Are you sure you want to PERMANENTLY remove your user: ${user.username}`)) {
      quizService.deleteUser(user.id).then(() => {
        handleLogout();
      });
    }
  };

  if (!role) {
    return (
      <RoleSelect handleSetRole={handleSetRole} user={user} />
    );
  }

  return (
    <div>
      <ReactNotifications />
      <div>
        <Link to="/">Start</Link>
        <Link to="/sessions">Sessions</Link>
        {role === "host" && user && <Link to="/quizzes">Quizzes</Link>}
        {role === "host" && (user ? <span><em>{user.username} logged in</em> <button onClick={handleLogout}>logout</button></span> : <Link to="/signin">sign in</Link>)}
        {role === "host" && user && <button onClick={deleteUser}>Delete user</button>}
      </div>
      <Routes>
        <Route path="/" element={<RoleSelect handleSetRole={handleSetRole} user={user} />} />
        <Route path="/sessions" element={<Sessions sessions={sessions} setSessions={setSessions} user={user} role={role} deleteSession={deleteSession}/>} />
        <Route path="/sessions/:id" element={<Session quizzes={quizzes} user={user} role={role} deleteSession={deleteSession}/>} />
        {role === "host" && user && <Route path="/quizzes" element={<Quizzes quizzes={quizzes} user={user} deleteQuiz={deleteQuiz}/>} />}
        {role === "host" && user && <Route path="/quizzes/create" element={<QuizCreate quizzes={quizzes} setQuizzes={setQuizzes}/>} />}
        {role === "host" && <Route path="/signin" element={<SignIn handleLogin={handleLogin}/>} />}
      </Routes>
    </div>
  );
};

export default App;
