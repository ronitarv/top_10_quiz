import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "../services/quizzes";
import Quizzes from "./Quizzes";
import { warningNotification } from "../utils/helper";
import { Store } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import { deleteSession } from "../reducers/sessionReducer";
import styles from "../css/Session.module.css";

function useInterval(callback, delay) {
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;
}


const Session = ({ removeSession }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);
  const [session, setSession] = useState(null);

  const id = useParams().id;
  useEffect(() => {
    console.log("useEffect");
    quizService.getSession(id)
      .then(s => {
        setSession(s);
      })
      .catch(() => {
        console.log("error effect");
        Store.addNotification(warningNotification("Session", "The session was deleted"));
        dispatch(deleteSession(id));
        navigate("/sessions");
      });
  }, []);

  useInterval(() => {
    if (session && (!user || session.user.id !== user.id || role === "player")) {
      quizService.getSession(id)
        .then(s => {
          setSession(s);
        })
        .catch(() => {
          console.log("error polling");
          Store.addNotification(warningNotification("Session", `The session "${session.name}" was deleted`));
          dispatch(deleteSession(id));
          navigate("/sessions");
        });
    }
  }, 5000);

  const handleReveal = (answer, index) => {
    const newSession = { ...session };
    newSession.answers[index] = newSession.answers[index] === "?" ? answer : "?";
    setSession(newSession);
    quizService.updateSession(newSession)
      .then(s => {
        setSession(s);
      });
  };

  const handleChange = () => {
    quizService.updateSession({ ...session, quiz: null });
    setSession({ ...session, quiz: null });
  };

  const handleQuizSelect = (quiz) => {
    quizService.updateSession({ ...session, quiz: quiz, answers: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"] })
      .then(newSession => {
        setSession(newSession);
      });
  };

  const onSessionDelete = () => {
    if (removeSession(session)) {
      navigate("/sessions");
    }
  };

  if (!session) {
    return (
      <div>loading...</div>
    );
  }

  if (!session.quiz) {
    if (user && session.user.id === user.id && role === "host") {
      return (
        <Quizzes quizzes={quizzes} handleSelect={handleQuizSelect} user={user}/>
      );
    } else {
      return (
        <div>changing quiz</div>
      );
    }
  }

  return (
    <div className={styles.body}>
      <h3>{session.name}</h3>
      <h3><i>{session.quiz.question}</i></h3>
      <div className={styles.container}>
        <div className={styles.playerAnswers}>
          <ol>
            {session.answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ol>
        </div>
        {
          role === "host" && session.quiz.answers &&
          <div className={styles.hostAnswers}>
            <ol>
              {session.quiz.answers.map((answer, index) => (
                <li key={index}><div className={styles.revealDiv}><button className={`${styles.revealButton} ${session.answers[index] !== "?" ? styles.checkedButton : ""}`} onClick={() => handleReveal(answer, index)}>{answer}</button></div></li>
              ))}
            </ol>
            <div className={styles.optionButtons}>
              <button onClick={handleChange}>Change Quiz</button><button onClick={onSessionDelete}>Delete session</button>
            </div>
          </div>
        }
      </div>
    </div>
  );

};

export default Session;