import {useState} from "react";
import {Link} from "react-router-dom";
import quiz_service from "../services/quizzes";

const Sessions = ({sessions, set_sessions}) => {
  const [name, set_name] = useState("");

  const on_submit = (event) => {
    event.preventDefault();
    quiz_service.create_session({name})
      .then(session => {
        set_sessions(sessions.concat(session));
      });
  };

  return (
    <div>
      <h1>Sessions</h1>
      <h3>Create new</h3>
      <form onSubmit={on_submit}>
        name: <input type="text" value={name} onChange={(e) => set_name(e.target.value)} />
        <button type="submit">create</button>
      </form>
      <ul>
        {sessions.map(session => (
          <li key={session.name}>
            <Link to={`/sessions/${session.id}`}>{session.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;