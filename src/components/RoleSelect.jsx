import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../reducers/roleReducer";

const RoleSelect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.user);

  const handleSetRole = (role) => {
    dispatch(setRole(role));
    window.localStorage.setItem("top10QuizAppRole", JSON.stringify(role));
    if (role === "host") {
      if (user) {
        navigate("/sessions");
      } else {
        navigate("/signin");
      }
    } else {
      navigate("/sessions");
    }
  };

  // const onRoleSelect = (role) => {
  //   handleSetRole(role);
  //   if (role === "host") {
  //     if (user) {
  //       navigate("/sessions");
  //     } else {
  //       navigate("/signin");
  //     }
  //   } else {
  //     navigate("/sessions");
  //   }
  // };

  return (
    <div>
      <h2>Choose your role</h2>
      <button onClick={() => handleSetRole("host")}>Host</button>
      <button onClick={() => handleSetRole("player")}>Player</button>
    </div>
  );
};

export default RoleSelect;