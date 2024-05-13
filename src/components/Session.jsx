import {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import quizService from "../services/quizzes";
import Quizzes from "./Quizzes";
import {errorNotification, successNotification, warningNotification} from "../utils/helper";
import {Store} from "react-notifications-component";

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


const Session = ({quizzes, user, role, deleteSession}) => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  const id = useParams().id;
  useEffect(() => {
    console.log("useEffect");
    quizService.getSession(id)
      .then(s => {
        setSession(s);
      })
      .catch(() => {
        Store.addNotification(warningNotification);
      });
  }, []);

  useInterval(() => {
    if (session && (!user || session.user.id !== user.id || role === "player")) {
      quizService.getSession(id)
        .then(s => {
          setSession(s);
        });
    }
  }, 5000);

  const handleReveal = (answer, index) => {
    const newSession = {...session};
    newSession.answers[index] = newSession.answers[index] === "?" ? answer : "?";
    quizService.updateSession(newSession)
      .then(s => {
        setSession(s);
      });
  };

  const handleChange = () => {
    quizService.updateSession({...session, quiz: null});
    setSession({...session, quiz: null});
  };

  const handleQuizSelect = (quiz) => {
    quizService.updateSession({...session, quiz: quiz, answers: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]})
      .then(newSession => {
        setSession(newSession);
      });
  };

  const onSessionDelete = () => {
    if (deleteSession(session)) {
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
    <div>
      <h2>{session.name}</h2>
      <h3>{session.quiz.question}</h3>
      <ol>
        {session.answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ol>
      {
        role === "host" && session.quiz.answers &&
        <div>
          <ol>
            {session.quiz.answers.map((answer, index) => (
              <li key={index}><button onClick={() => handleReveal(answer, index)}>{answer}</button></li>
            ))}
          </ol>
          <button onClick={handleChange}>Change Quiz</button><button onClick={onSessionDelete}>Delete session</button>
        </div>
      }
    </div>
  );

};

export default Session;