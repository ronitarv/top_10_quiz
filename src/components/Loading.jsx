import { BiLoaderCircle } from "react-icons/bi";
import styles from "../css/Loading.module.css";

const Loading = ({ text }) => {
  return (
    <div className={styles.body}>
      <div>{text}</div>
      <BiLoaderCircle className={styles.loadingIcon} />
    </div>
  );
};

export default Loading;