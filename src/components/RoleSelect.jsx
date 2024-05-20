import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../reducers/roleReducer";
import styles from "../css/RoleSelect.module.css";

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
    <div className={styles.body}>
      <div className={styles.div}>
        <button className={`${styles.button} ${styles.host}`} onClick={() => handleSetRole("host")}>Host</button>
        <button className={`${styles.button} ${styles.player}`} onClick={() => handleSetRole("player")}>Player</button>
      </div>
    </div>
  );
};

export default RoleSelect;