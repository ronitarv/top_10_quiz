import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizService from "../services/quizzes";
import Quizzes from "./Quizzes";
import { warningNotification } from "../utils/helper";
import { Store } from "react-notifications-component";
import { useDispatch, useSelector } from "react-redux";
import { deleteSession } from "../reducers/sessionReducer";
import styles from "../css/Session.module.css";
import Loading from "./Loading";

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


const Session = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const user = useSelector(state => state.user);
  const role = useSelector(state => state.role);
  const [session, setSession] = useState(null);
  const [newAnswers, setNewAnswers] = useState([]);
  // let dialog = document.getElementById("dialog");
  const dialogRef = useRef();

  const id = useParams().id;
  useEffect(() => {
    quizService.getSession(id)
      .then(s => {
        setSession(s);
      })
      .catch(() => {
        Store.addNotification(warningNotification("Session", "The session was deleted"));
        dispatch(deleteSession(id));
        navigate("/sessions");
      });
  }, []);

  useInterval(() => {
    if (session && (!user || session.user.id !== user.id || role === "player")) {
      quizService.getSession(id)
        .then(s => {
          setNewAnswers(s.answers.map((a, index) => !session.answers.includes(a) ? index : null).filter(a => a !== null));
          setSession(s);
        })
        .catch(() => {
          Store.addNotification(warningNotification("Session", `The session "${session.name}" was deleted`));
          dispatch(deleteSession(id));
          navigate("/sessions");
        });
    }
  }, 5000);

  const removeSession = () => {
    dialogRef.current?.close();
    quizService.deleteSession(session.id).then(() => {
      dispatch(deleteSession(session.id));
      navigate("/sessions");
    });
  };

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
    // if (!dialog) {
    //   dialog = document.getElementById("dialog");
    // }
    // console.log("dialog", dialog);
    dialogRef.current?.showModal();
  };

  if (!session) {
    return <Loading text={null} />;
  }

  if (!session.quiz) {
    if (user && session.user.id === user.id && role === "host") {
      return (
        <Quizzes quizzes={quizzes} handleSelect={handleQuizSelect} user={user}/>
      );
    } else {
      return <Loading text="changing quiz" />;
    }
  }

  return (
    <div>
      <dialog id="dialog" className={styles.dialog} ref={dialogRef}>
        <h2>Remove session?</h2>
        <p>Are you sure you want to remove the session &quot;{session.name}&quot;</p>
        <div className={styles.buttons}><button style={{ "backgroundColor": "#8388a4", "color": "black" }} onClick={() => dialogRef.current?.close()}>Cancel</button><button style={{ "backgroundColor": "#ed5e68", "color": "white" }} onClick={removeSession}>Remove</button></div>
      </dialog>
      <div className={styles.body}>
        <h3>{session.name}</h3>
        <h3><i>{session.quiz.question}</i></h3>
        <div className={styles.container}>
          <div className={styles.playerAnswers}>
            <ol>
              {session.answers.map((answer, index) => (
                <li key={index} className={newAnswers.includes(index) ? styles.new : styles.notNew}>{answer}</li>
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
                <button onClick={handleChange}>Change Quiz</button><button onClick={onSessionDelete}>Remove session</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );

};

export default Session;