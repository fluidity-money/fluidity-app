import React from "react";
import styles from "./ResourcesNavModal.module.scss";

interface IResourcesNavModal {
  handleModal: () => void;
}

const ResourcesNavModal = ({ handleModal }: IResourcesNavModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      <h4>
        <a onClick={() => handleModal()} href="/resources#articles">
          {"Articles >"}
        </a>
      </h4>
      <h4>
        <a onClick={() => handleModal()} href="/resources#fluniversity">
          {"Fluniversity >"}
        </a>
      </h4>
      <h4>
        <a onClick={() => handleModal()} href="/resources#whitepapers">
          {"Whitepapers >"}
        </a>
      </h4>
      <h4>
        <a onClick={() => handleModal()} href="/resources#docs">
          {"Documentation [>]"}
        </a>
      </h4>
    </div>
  );
};

export default ResourcesNavModal;
