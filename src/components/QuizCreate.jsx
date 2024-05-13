import {useState} from "react";
import quizService from "../services/quizzes";
import {useNavigate} from "react-router-dom";

const QuizCreate = ({quizzes, setQuizzes}) => {
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
    quizService.createQuiz({question, answers})
      .then(newQuiz => {
        setQuizzes(quizzes.concat(newQuiz));
        navigate("/quizzes");
      });
  };

  return (
    <div>
      <h2>Create Quiz</h2>
      <form onSubmit={onSubmit}>
        question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
        {answers.map((answer, index) => (
          <div key={index+1}>{index+1}.<input type="text" value={answer} onChange={(e) => onAnswer(e.target.value, index)} /></div>
        ))};
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default QuizCreate;