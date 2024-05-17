import { useEffect, useState } from "react";
import quizService from "../services/quizzes";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz } from "../reducers/quizReducer";
import { Store } from "react-notifications-component";
import { errorNotification, warningNotification } from "../utils/helper";

const QuizUpdate = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector(state => state.quizzes);
  const id = useParams().id;
  console.log("id", id);
  const quiz = quizzes.find(q => q.id === id);
  console.log("quiz", quiz);
  const navigate = useNavigate();
  //const history = useHistory();

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
    <div>
      <h2>Update Quiz</h2>
      <form onSubmit={onSubmit}>
        question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
        {answers.map((answer, index) => (
          <div key={index+1}>{index+1}.<input type="text" value={answer} onChange={(e) => onAnswer(e.target.value, index)} /></div>
        ))}
        <button type="submit">update</button>
      </form>
    </div>
  );
};

export default QuizUpdate;