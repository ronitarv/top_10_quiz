import {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
import quiz_service from "../services/quizzes";
import Quizzes from "./Quizzes";

function useInterval(callback, delay) {
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setInterval ticks again, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // interval will be reset.

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval:

  useEffect(() => {
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(() => callbackRef.current(), delay);

      // Clear interval if the components is unmounted or the delay changes:
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  // Returns a ref to the interval ID in case you want to clear it manually:
  return intervalRef;
}


const Session = ({quizzes, user}) => {
  const [session, set_session] = useState(null);

  const id = useParams().id;
  useEffect(() => {
    console.log("useEffect");
    quiz_service.get_session(id)
      .then(s => {
        set_session(s);
      }, []);
  }, []);

  const intervalRef = useInterval(() => {
    if (session && (!user || session.user.id !== user.id)) {
      console.log("poll sent");
      quiz_service.get_session(id)
        .then(s => {
          console.log("poll received");
          set_session(s);
        });
    }
    // } else {
    //   window.clearInterval(intervalRef.current);
    // }
  }, 5000);

  // useEffect(() => {
  //   console.log("user session", user, session);
  //   if (!user || user.id !== session.user.id) {
  //     const interval = setInterval(() => {
  //       console.log("poll sent");
  //       quiz_service.get_session(id)
  //         .then(session => {
  //           console.log("poll received");
  //           set_session(session);
  //         });
  //     }, 5000);
  //     return () => clearInterval(interval);
  //   }
  // });

  // useEffect(() => {

  // }, []);

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

  if (!session) {
    return (
      <div>loading...</div>
    );
  }

  if (!session.quiz) {
    return (
      <Quizzes quizzes={quizzes} handle_select={handle_quiz_select} />
    );
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
          <button onClick={handle_change}>Change Quiz</button>
        </div>
      }
    </div>
  );

};

export default Session;