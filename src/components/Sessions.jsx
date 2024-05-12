import {useState} from "react";
import {Link} from "react-router-dom";
import quiz_service from "../services/quizzes";

const Sessions = ({sessions, set_sessions, user, delete_session}) => {
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
      {user
        ?
        <div>
          <h3>Create new</h3>
          <form onSubmit={on_submit}>
            name: <input type="text" value={name} onChange={(e) => set_name(e.target.value)} />
            <button type="submit">create</button>
          </form>
          <h2>My sessions</h2>
          <ul>
            {sessions.filter(s => s.user.id === user.id).map(session => (
              <li key={session.name}>
                <Link to={`/sessions/${session.id}`}>{session.name}</Link><button onClick={() => delete_session(session)}>delete</button>
              </li>
            ))}
          </ul>
          <h2>Others sessions</h2>
          <ul>
            {sessions.filter(s => s.user.id !== user.id).map(session => (
              <li key={session.name}>
                <Link to={`/sessions/${session.id}`}>{session.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        :
        <ul>
          {sessions.map(session => (
            <li key={session.name}>
              <Link to={`/sessions/${session.id}`}>{session.name}</Link>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default Sessions;