import { Link } from "react-router-dom";
import styles from "./ResourcesNavModal.module.scss";

interface IResourcesNavModal {
  handleModal: () => void;
}

const ResourcesNavModal = ({ handleModal }: IResourcesNavModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      <h4>
        <Link onClick={() => handleModal()} to="/resources#articles">
          {"Articles >"}
        </Link>
      </h4>
      <h4>
        <Link onClick={() => handleModal()} to="/resources#fluniversity">
          {"Fluniversity >"}
        </Link>
      </h4>
      <h4>
        <Link onClick={() => handleModal()} to="/resources#whitepapers">
          {"Whitepapers >"}
        </Link>
      </h4>
      <h4>
        <Link onClick={() => handleModal()} to="/resources#docs">
          {"Documentation [>]"}
        </Link>
      </h4>
    </div>
  );
};

export default ResourcesNavModal;
