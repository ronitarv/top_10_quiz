import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import quizService from "../services/quizzes";
import { deleteQuiz } from "../reducers/quizReducer";
import styles from "../css/Quizzes.module.css";
import { useState, useRef, useEffect } from "react";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { setUser } from "../reducers/userReducer";


const Quizzes = ({ handleSelect }) => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const user = useSelector(state => state.user);
  const [deletableQuiz, setDeletableQuiz] = useState(null);
  const dialogRef = useRef();

  useEffect(() => {
    window.localStorage.setItem("top10QuizAppUser", JSON.stringify(user));
  }, [user]);

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

  const saveQuiz = (quizId) => {
    if (user.savedQuizzes.includes(quizId)) {
      dispatch(setUser({ ...user, savedQuizzes: user.savedQuizzes.filter(q => q !== quizId) }));
    } else {
      dispatch(setUser({ ...user, savedQuizzes: user.savedQuizzes.concat(quizId) }));
    }
    window.localStorage.setItem("top10QuizAppUser", JSON.stringify(user));
    quizService.saveQuiz(user.id, quizId);
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
                    <button onClick={() => onRemoveQuiz(quiz)}>remove</button><Link to={`/quizzes/update/${quiz.id}`}><button>update</button></Link>{user.savedQuizzes.includes(quiz.id) ? <FaHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/> : <FaRegHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/>}
                  </div>
                </div>
              ))}
            </div>
          </details>
          <details open>
            <summary>Saved quizzes</summary>
            <div className={styles.quizzes}>
              {quizzes.filter(q => user.savedQuizzes.includes(q.id)).map(quiz => (
                <div key={quiz.question} className={styles.quiz}>
                  <button className={styles.select} onClick={handleSelect ? () => handleSelect(quiz) : null}>
                    <div>
                      <h2 style={{ "marginBottom": "0px" }}>{quiz.question}</h2>
                      <div style={{ "fontSize": "1.5rem" }}>by {quiz.user.username}</div>
                    </div>
                    {quiz.answers &&
                    <ol>
                      {quiz.answers.map((answer, index) => (
                        <li key={index + answer}>{answer}</li>
                      ))}
                    </ol>}
                  </button>
                  <div className={styles.optionButtons}>
                    {quiz.user.id === user.id && <span><button onClick={() => onRemoveQuiz(quiz)}>remove</button><Link to={`/quizzes/update/${quiz.id}`}><button>update</button></Link></span>}{user.savedQuizzes.includes(quiz.id) ? <FaHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/> : <FaRegHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/>}
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
                    <div>
                      <h2 style={{ "marginBottom": "0px" }}>{quiz.question}</h2>
                      <div style={{ "fontSize": "1.5rem" }}>by {quiz.user.username}</div>
                    </div>
                    {quiz.answers &&
                  <ol>
                    {quiz.answers.map((answer, index) => (
                      <li key={index + answer}>{answer}</li>
                    ))}
                  </ol>}
                  </button>
                  <div className={styles.optionButtons}>
                    {user.savedQuizzes.includes(quiz.id) ? <FaHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/> : <FaRegHeart className={styles.saveIcon} onClick={() => saveQuiz(quiz.id)}/>}
                  </div>
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