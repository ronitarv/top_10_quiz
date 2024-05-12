import {useState} from "react";
import quiz_service from "../services/quizzes";
import {useNavigate} from "react-router-dom";

const QuizCreate = ({quizzes, set_quizzes}) => {
  const navigate = useNavigate();

  const [question, set_question] = useState("");
  const [answers, set_answers] = useState(["", "", "", "", "", "", "", "", "", ""]);

  const on_answer = (value, index) => {
    const new_answers = [...answers];
    new_answers[index] = value;
    set_answers(new_answers);
  };

  const on_submit = (event) => {
    event.preventDefault();
    quiz_service.create_quiz({question, answers})
      .then(new_quiz => {
        set_quizzes(quizzes.concat(new_quiz));
        navigate("/quizzes");
      });
  };

  return (
    <div>
      <h2>Create Quiz</h2>
      <form onSubmit={on_submit}>
        question: <input type="text" value={question} onChange={(e) => set_question(e.target.value)} />
        {answers.map((answer, index) => (
          <div key={index+1}>{index+1}.<input type="text" value={answer} onChange={(e) => on_answer(e.target.value, index)} /></div>
        ))};
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default QuizCreate;