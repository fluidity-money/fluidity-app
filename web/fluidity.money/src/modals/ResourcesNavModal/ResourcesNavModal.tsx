import { LinkButton } from "components/Button";
import styles from "./ResourcesNavModal.module.scss";

interface IResourcesNavModal {
  handleModal: () => void;
  navLinks: ILinkButton[];
}

interface ILinkButton {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

const ResourcesNavModal = ({ handleModal, navLinks }: IResourcesNavModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      {navLinks.map((link) => (
        <h4>
          <a onClick={() => handleModal()} href="/resources#articles">
            <LinkButton
              size={link.size}
              type={link.type}
              handleClick={() => {}}
            >
              {link.children}
            </LinkButton>
          </a>
        </h4>
      ))}
    </div>
  );
};

export default ResourcesNavModal;
