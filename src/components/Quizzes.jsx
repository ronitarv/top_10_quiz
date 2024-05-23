import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import quizService from "../services/quizzes";
import { deleteQuiz } from "../reducers/quizReducer";
import styles from "../css/Quizzes.module.css";

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
      <div className={styles.header}>
        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }}><h1>Quizzes</h1></div>
        {user && <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }}><Link to={"/quizzes/create"}><button>Create new</button></Link></div>}
      </div>
      <h2 style={{ "marginTop": "0px" }}>My quizzes</h2>
      <div className={styles.quizzes}>
        {quizzes.filter(q => q.user.id === user.id).map(quiz => (
          <div key={quiz.question} className={styles.quiz}>
            <button className={styles.select} onClick={handleSelect ? () => handleSelect(quiz) : null}>
              <h2>{quiz.question}</h2>
              {quiz.answers &&
              <ol>
                {quiz.answers.map((answer, index) => (
                  <li key={index + answer}>{answer}</li>
                ))}
              </ol>}
            </button>
            <div className={styles.optionButtons}>
              <button onClick={() => removeQuiz(quiz)}>remove</button><Link to={`/quizzes/update/${quiz.id}`}><button>update</button></Link>
            </div>
          </div>
        ))}
      </div>
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