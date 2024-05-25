import { useEffect, useState } from "react";
import quizService from "../services/quizzes";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz } from "../reducers/quizReducer";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";
import styles from "../css/QuizForm.module.css";

const QuizUpdate = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const id = useParams().id;
  const quiz = quizzes.find(q => q.id === id);
  const navigate = useNavigate();

  const [question, setQuestion] = useState(quiz && quiz.question ? quiz.question : "");
  const [answers, setAnswers] = useState(quiz && quiz.answers ? quiz.answers : ["", "", "", "", "", "", "", "", "", ""]);

  useEffect(() => {
    setQuestion(quiz && quiz.question ? quiz.question : "");
    setAnswers(quiz && quiz.answers ? quiz.answers : ["", "", "", "", "", "", "", "", "", ""]);
  }, [quiz]);

  const onAnswer = (value, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (quizzes.find(q => q.question === question && q.id !== id)) {
      return Store.addNotification(warningNotification("Quiz update", "A quiz with the question already exists"));
    } if (!question) {
      return Store.addNotification(warningNotification("Quiz update", "Question missing"));
    } if (answers.includes("")) {
      return Store.addNotification(warningNotification("Quiz update", "Answers missing"));
    }
    quizService.updateQuiz({ ...quiz, question, answers })
      .then(newQuiz => {
        dispatch(updateQuiz(newQuiz));
        navigate(-1);
      })
      .catch(() => {
        Store.addNotification(errorNotification("Quiz update", "There was an error creating the quiz, refreshing the page is recommended"));
      });
  };

  return (
    <div className={styles.body}>
      <h2>Update quiz</h2>
      <form className={styles.container} onSubmit={onSubmit}>
        <ol>
          <li className={styles.question}><input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} /></li>
          <div className={styles.answers}>
            {answers.map((answer, index) => (
              <li key={index+1}><input type="text" value={answer} onChange={(e) => onAnswer(e.target.value, index)} /></li>
            ))}
          </div>
        </ol>
        <button type="submit">update</button>
      </form>
    </div>
  );
};

export default QuizUpdate;