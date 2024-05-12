import {Link} from "react-router-dom";

const Quizzes = ({quizzes, handle_select}) => {

  return (
    <div>
      <h1>quizzes</h1>
      <Link to={"/quizzes/create"}><button>Create new</button></Link>
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.question}>
            <div>{quiz.question}</div>
            <ul></ul>
            {quiz.answers &&
            <ol>
              {quiz.answers.map(answer => (
                <li key={answer}>{answer}</li>
              ))}
            </ol>}
            {handle_select && <button onClick={() => handle_select(quiz)}>Select</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;