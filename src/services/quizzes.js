import axios from "axios";

const quiz_url = "/api/quizzes";
const session_url = "/api/sessions";
const login_url = "/api/login";
const user_url = "api/user";

let token = null;

const set_token = new_token => {
  if (new_token) {
    token = `Bearer ${new_token}`;
  } else {
    token = new_token;
  }
};

const get_quizzes = async () => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.get(quiz_url, config);
  return req.data;
};

const create_quiz = async quiz_data => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.post(quiz_url, quiz_data, config);
  return req.data;
};

const delete_quiz = async id => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.delete(`${quiz_url}/${id}`, config);
  return req.status;
};

const get_sessions = async () => {
  const req = await axios.get(session_url);
  return req.data;
};

const get_session = async id => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.get(`${session_url}/${id}`, config);
  return req.data;
};

const create_session = async session_data => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.post(session_url, session_data, config);
  return req.data;
};

const delete_session = async id => {
  const config = {
    headers: {Authorization: token}
  };
  const req = await axios.delete(`${session_url}/${id}`, config);
  return req.status;
};

const update_session = async (session_data) => {
  const config = {
    headers: {Authorization: token}
  };
  const user_id = session_data.user ? session_data.user.id : null;
  const quiz_id = session_data.quiz ? session_data.quiz.id : null;
  const req = await axios.put(`${session_url}/${session_data.id}`, {
    ...session_data,
    user: user_id,
    quiz: quiz_id
  }, config);
  return req.data;
};

const create_user = async credentials => {
  const req = await axios.post(user_url, credentials);
  return req.data;
};

const login = async credentials => {
  const req = await axios.post(login_url, credentials);
  return req.data;
};

export default {
  set_token, get_quizzes, create_quiz, delete_quiz,
  get_sessions, get_session, create_session, delete_session,
  update_session, create_user, login
};