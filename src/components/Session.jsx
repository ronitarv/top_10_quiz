import {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import quiz_service from "../services/quizzes";
import Quizzes from "./Quizzes";

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


const Session = ({quizzes, user, delete_session}) => {
  const navigate = useNavigate();
  const [session, set_session] = useState(null);

  const id = useParams().id;
  useEffect(() => {
    console.log("useEffect");
    quiz_service.get_session(id)
      .then(s => {
        set_session(s);
      }, []);
  }, []);

  useInterval(() => {
    if (session && (!user || session.user.id !== user.id)) {
      console.log("poll sent");
      quiz_service.get_session(id)
        .then(s => {
          console.log("poll received");
          set_session(s);
        });
    }
  }, 5000);

  const handle_reveal = (answer, index) => {
    const new_session = {...session};
    new_session.answers[index] = new_session.answers[index] === "?" ? answer : "?";
    quiz_service.update_session(new_session)
      .then(s => {
        set_session(s);
      });
  };

  const handle_change = () => {
    quiz_service.update_session({...session, quiz: null});
    set_session({...session, quiz: null});
  };

  const handle_quiz_select = (quiz) => {
    quiz_service.update_session({...session, quiz: quiz, answers: ["?", "?", "?", "?", "?", "?", "?", "?", "?", "?"]})
      .then(new_session => {
        set_session(new_session);
      });
  };

  const on_session_delete = () => {
    delete_session(session);
    navigate("/");
  };

  if (!session) {
    return (
      <div>loading...</div>
    );
  }

  if (!session.quiz) {
    if (user && session.user.id === user.id) {
      return (
        <Quizzes quizzes={quizzes} handle_select={handle_quiz_select} user={user}/>
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
        session.quiz.answers &&
        <div>
          <ol>
            {session.quiz.answers.map((answer, index) => (
              <li key={index}><button onClick={() => handle_reveal(answer, index)}>{answer}</button></li>
            ))}
          </ol>
          <button onClick={handle_change}>Change Quiz</button><button onClick={on_session_delete}>Delete session</button>
        </div>
      }
    </div>
  );

};

export default Session;