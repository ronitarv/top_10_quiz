import {Link} from "react-router-dom";

const Quizzes = ({quizzes, handle_select, user, delete_quiz}) => {

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
              {quiz.answers.map(answer => (
                <li key={answer}>{answer}</li>
              ))}
            </ol>}
            {handle_select && <button onClick={() => handle_select(quiz)}>Select</button>}
            <button onClick={() => delete_quiz(quiz)}>remove</button>
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
            {handle_select && <button onClick={() => handle_select(quiz)}>Select</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;