import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import quizService from "../services/quizzes";
import { deleteQuiz } from "../reducers/quizReducer";
import styles from "../css/Quizzes.module.css";
import { useState, useRef } from "react";


const Quizzes = ({ handleSelect }) => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const user = useSelector(state => state.user);
  const [deletableQuiz, setDeletableQuiz] = useState(null);
  const dialogRef = useRef();

  const onRemoveQuiz = (quiz) => {
    setDeletableQuiz(quiz);
    dialogRef.current?.showModal();
  };

  const cancelRemoveQuiz = () => {
    setDeletableQuiz(null);
    dialogRef.current?.close();
  };

  const removeQuiz = () => {
    setDeletableQuiz(null);
    dialogRef.current?.close();
    quizService.deleteQuiz(deletableQuiz.id).then(() => {
      dispatch(deleteQuiz(deletableQuiz.id));
    });
  };

  return (
    <div>
      <dialog id="dialog" className={styles.dialog} ref={dialogRef}>
        <h2>Remove quiz?</h2>
        <p>Are you sure you want to remove the quiz &quot;{deletableQuiz && deletableQuiz.question}&quot;</p>
        <div className={styles.buttons}><button style={{ "backgroundColor": "#8388a4", "color": "black" }} onClick={cancelRemoveQuiz}>Cancel</button><button style={{ "backgroundColor": "#ed5e68", "color": "white" }} onClick={removeQuiz}>Remove</button></div>
      </dialog>
      <div className={styles.body}>
        <div className={styles.header}>
          <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }}><h1>Quizzes</h1></div>
          {user && <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "20px" }}><Link to={"/quizzes/create"}><button>Create new</button></Link></div>}
        </div>
        <div className={styles.content}>
          <details open>
            <summary>My quizzes</summary>
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
                    <button onClick={() => onRemoveQuiz(quiz)}>remove</button><Link to={`/quizzes/update/${quiz.id}`}><button>update</button></Link>
                  </div>
                </div>
              ))}
            </div>
          </details>
          <details open>
            <summary>Others quizzes</summary>
            <div className={styles.quizzes}>
              {quizzes.filter(q => q.user.id !== user.id).map(quiz => (
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
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;