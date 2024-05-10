import {useState, useEffect} from "react";
import quiz_service from "../services/quizzes";

const Sessions = () => {
  const [sessions, set_sessions] = useState([]);

  useEffect(() => {
    quiz_service.get_sessions()
      .then(sessions => {
        set_sessions(sessions);
      });
  }, []);

  return (
    <div>
      <h1>Sessions</h1>
      <ul>
        {sessions.map(session => (
          <li key={session.name}>
            {session.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;