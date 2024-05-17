import { useState } from "react";
import { Link } from "react-router-dom";
import quizService from "../services/quizzes";
import { useDispatch, useSelector } from "react-redux";
import { createSession, setSessions } from "../reducers/sessionReducer";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";

const Sessions = ({ removeSession }) => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);
  const [name, setName] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (sessions.find(s => s.name === name)) {
      return Store.addNotification(warningNotification("Create session", "A session with the name already exists"));
    }
    if (!name) {
      return Store.addNotification(warningNotification("Create session", "Name for the session is missing"));
    }
    quizService.createSession({ name })
      .then(session => {
        dispatch(createSession(session));
        setName("");
      })
      .catch(() => {
        Store.addNotification(errorNotification("Create session", "There was an error creating the session, refreshing the page is recommended"));
      });
  };

  const refetchSessions = () => {
    quizService.getSessions()
      .then(sessions => {
        dispatch(setSessions(sessions));
      });
  };

  return (
    <div>
      <h1>Sessions</h1><button onClick={refetchSessions}>update</button>
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
                <Link to={`/sessions/${session.id}`}>{session.name}</Link><button onClick={() => removeSession(session)}>delete</button>
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