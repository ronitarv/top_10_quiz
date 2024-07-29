import { useState } from "react";
import quizService from "../services/quizzes";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createQuiz } from "../reducers/quizReducer";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";
import styles from "../css/QuizForm.module.css";

const QuizCreate = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", "", "", "", "", "", "", ""]);

  const onAnswer = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (quizzes.find(q => q.question === question)) {
      return Store.addNotification(warningNotification("Create quiz", "A quiz with the question already exists"));
    } if (!question) {
      return Store.addNotification(warningNotification("Create quiz", "Question missing"));
    } if (answers.includes("")) {
      return Store.addNotification(warningNotification("Create quiz", "Answers missing"));
    }
    quizService.createQuiz({ question, answers })
      .then(newQuiz => {
        dispatch(createQuiz(newQuiz));
        navigate(-1);
      })
      .catch(() => {
        Store.addNotification(errorNotification("Quiz create", "There was an error creating the quiz, refreshing the page is recommended"));
      });
  };

  return (
    <div className={styles.body}>
      <h2>Create quiz</h2>
      <form className={styles.container} onSubmit={onSubmit}>
        <ol>
          <li className={styles.question}><input type="text" value={question} maxLength={100} onChange={(e) => setQuestion(e.target.value)} /></li>
          <div className={styles.answers}>
            {answers.map((answer, index) => (
              <li key={index+1}><input type="text" value={answer} maxLength={100} onChange={(e) => onAnswer(e.target.value, index)} /></li>
            ))}
          </div>
        </ol>
        <button type="submit">create</button>
      </form>
    </div>
  );
};


export default QuizCreate;