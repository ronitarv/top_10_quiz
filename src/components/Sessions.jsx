import {useState} from "react";
import {Link} from "react-router-dom";
import quizService from "../services/quizzes";

const Sessions = ({sessions, setSessions, user, role, deleteSession}) => {
  const [name, setName] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    quizService.createSession({name})
      .then(session => {
        setSessions(sessions.concat(session));
      });
  };

  return (
    <div>
      <h1>Sessions</h1>
      {(user && role === "host")
        ?
        <div>
          <h3>Create new</h3>
          <form onSubmit={onSubmit}>
            name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit">create</button>
          </form>
          <h2>My sessions</h2>
          <ul>
            {sessions.filter(s => s.user.id === user.id).map(session => (
              <li key={session.name}>
                <Link to={`/sessions/${session.id}`}>{session.name}</Link><button onClick={() => deleteSession(session)}>delete</button>
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