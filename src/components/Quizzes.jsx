import {useState, useEffect} from "react";
import quiz_service from "../services/quizzes";

const Quizzes = () => {
  const [quizzes, set_quizzes] = useState([]);

  useEffect(() => {
    quiz_service.get_quizzes()
      .then(quizzes => {
        set_quizzes(quizzes);
      });
  }, []);

  return (
    <div>
      <h1>quizzes</h1>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.question}>
            <div>{quiz.question}</div>
            <ul></ul>
            {quiz.answers &&
            <ul>
              {quiz.answers.map(answer => (
                <li key={answer}>{answer}</li>
              ))}
            </ul>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;