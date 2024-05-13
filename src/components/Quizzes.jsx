import {Link} from "react-router-dom";

const Quizzes = ({quizzes, handleSelect, user, deleteQuiz}) => {

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
            {handleSelect && <button onClick={() => handleSelect(quiz)}>Select</button>}
            <button onClick={() => deleteQuiz(quiz)}>remove</button>
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
            {handleSelect && <button onClick={() => handleSelect(quiz)}>Select</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quizzes;