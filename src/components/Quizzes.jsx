import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import quizService from "../services/quizzes";
import { deleteQuiz } from "../reducers/quizReducer";

const Quizzes = ({ handleSelect }) => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const user = useSelector(state => state.user);

  const removeQuiz = (quiz) => {
    if (window.confirm(`Are you sure you want to remove the quiz: ${quiz.question}`)) {
      quizService.deleteQuiz(quiz.id).then(() => {
        dispatch(deleteQuiz(quiz.id));
      });
    }
  };

  return (
    <div>
      <h1>quizzes</h1>
      {user && <Link to={"/quizzes/create"}><button>Create new</button></Link>}
      <h2>My quizzes</h2>
      <ul>
        {quizzes.filter(q => q.user.id === user.id).map(quiz => (
          <li key={quiz.question}>
            <div>{quiz.question}</div>
            <ul></ul>
            {quiz.answers &&
            <ol>
              {quiz.answers.map((answer, index) => (
                <li key={index + answer}>{answer}</li>
              ))}
            </ol>}
            {handleSelect && <button onClick={() => handleSelect(quiz)}>Select</button>}
            <button onClick={() => removeQuiz(quiz)}>remove</button><Link to={`/quizzes/update/${quiz.id}`}><button>update</button></Link>
          </li>
        ))}
      </ul>
      <h2>Others quizzes</h2>
      <ul>
        {quizzes.filter(q => q.user.id !== user.id).map(quiz => (
          <li key={quiz.question}>
            <div>{quiz.question}</div>
            <ul></ul>
            {quiz.answers &&
            <ol>
              {quiz.answers.map(answer => (
                <li key={answer}>{answer}</li>
              ))}
            </ol>}
            {handleSelect && <button onClick={() => handleSelect(quiz)}>Select</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;