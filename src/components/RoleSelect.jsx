import {useNavigate} from "react-router-dom";

const RoleSelect = ({handleSetRole, user}) => {
  const navigate = useNavigate();

  const onRoleSelect = (role) => {
    handleSetRole(role);
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

  return (
    <div>
      <h2>Choose your role</h2>
      <button onClick={() => onRoleSelect("host")}>Host</button>
      <button onClick={() => onRoleSelect("player")}>Player</button>
    </div>
  );
};

export default RoleSelect;