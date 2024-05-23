import { useState } from "react";
import { Link } from "react-router-dom";
import quizService from "../services/quizzes";
import { useDispatch, useSelector } from "react-redux";
import { createSession, setSessions } from "../reducers/sessionReducer";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";
import { IoMdRefresh } from "react-icons/io";
import styles from "../css/Sessions.module.css";
import { IoIosArrowRoundForward } from "react-icons/io";

const Sessions = () => {
  const dispatch = useDispatch();
  const sessions = useSelector(state => state.sessions);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(false);

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
    setRefresh(true);
    quizService.getSessions()
      .then(sessions => {
        dispatch(setSessions(sessions));
      });
  };

  return (
    <div>
      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px", "justifyContent": "space-between", "flexWrap": "wrap" }} >
        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }} >
          <h1>Sessions</h1>
          <button className={styles.refreshButton} onClick={refetchSessions}>
            <IoMdRefresh className={`${styles.refreshIcon} ${refresh ? styles.spin : ""}`} onAnimationEnd={() => setRefresh(false)} />
          </button>
        </div>
        {role === "host" && user &&
          <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }} >
            <h3>Create new</h3>
            <form onSubmit={onSubmit} className={styles.webflowStyleInput}>
              <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
              <button type="submit"><IoIosArrowRoundForward /></button>
            </form>
          </div>
        }
      </div>
      {(user && role === "host")
        ?
        <div>
          {/* </form> */}
          <h2>My sessions</h2>
          <div className={styles.sessions}>
            {sessions.filter(s => s.user.id === user.id).map(session => (
              <div key={session.name} className={styles.session}>
                <Link style={{ "textDecoration": "none" }} to={`/sessions/${session.id}`}>
                  <div style={{ "fontSize": "30px" }}>{session.name}</div>
                  <div>host: {session.user.username}</div>
                </Link>
              </div>
            ))}
          </div>
          <h2>Others sessions</h2>
          <div className={styles.sessions}>
            {sessions.filter(s => s.user.id !== user.id).map(session => (
              <div key={session.name} className={styles.session}>
                <Link style={{ "textDecoration": "none" }} to={`/sessions/${session.id}`}>
                  <div style={{ "fontSize": "30px" }}>{session.name}</div>
                  <div>host: {session.user.username}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        :
        <div className={styles.sessions}>
          {sessions.map(session => (
            <div key={session.name} className={styles.session}>
              <Link style={{ "textDecoration": "none" }} to={`/sessions/${session.id}`}>
                <div style={{ "fontSize": "30px" }}>{session.name}</div>
                <div>host: {session.user.username}</div>
              </Link>
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default Sessions;