import axios from "axios";

const quizUrl = "/api/quizzes";
const sessionUrl = "/api/sessions";
const loginUrl = "/api/login";
const userUrl = "api/user";

let token = null;

const setToken = newToken => {
  if (newToken) {
    token = `Bearer ${newToken}`;
  } else {
    token = newToken;
  }
};

const getQuizzes = async () => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.get(quizUrl, config);
  return req.data;
};

const createQuiz = async quizData => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.post(quizUrl, quizData, config);
  return req.data;
};

const updateQuiz = async (quizData) => {
  const config = {
    headers: { Authorization: token }
  };
  const userId = quizData.user ? quizData.user.id : null;
  const req = await axios.put(`${quizUrl}/${quizData.id}`, {
    ...quizData,
    user: userId
  }, config);
  return req.data;
};

const deleteQuiz = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.delete(`${quizUrl}/${id}`, config);
  return req.status;
};

const getSessions = async () => {
  const req = await axios.get(sessionUrl);
  return req.data;
};

const getSession = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.get(`${sessionUrl}/${id}`, config);
  return req.data;
};

const createSession = async sessionData => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.post(sessionUrl, sessionData, config);
  return req.data;
};

const deleteSession = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.delete(`${sessionUrl}/${id}`, config);
  return req;
};

const updateSession = async (sessionData) => {
  const config = {
    headers: { Authorization: token }
  };
  const userId = sessionData.user ? sessionData.user.id : null;
  const quizId = sessionData.quiz ? sessionData.quiz.id : null;
  const req = await axios.put(`${sessionUrl}/${sessionData.id}`, {
    ...sessionData,
    user: userId,
    quiz: quizId
  }, config);
  return req.data;
};

const createUser = async credentials => {
  const req = await axios.post(userUrl, credentials);
  return req.data;
};

const deleteUser = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const req = await axios.delete(`${userUrl}/${id}`, config);
  return req;
};

const login = async credentials => {
  const req = await axios.post(loginUrl, credentials);
  return req.data;
};

const tokenValid = async token => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const req = await axios.post(`${loginUrl}/valid`, token, config)
  return req.data;
}

export default {
  setToken, getQuizzes, createQuiz, updateQuiz, deleteQuiz,
  getSessions, getSession, createSession, deleteSession,
  updateSession, createUser, deleteUser, login, tokenValid
};