import ContinuousCarousel from "components/ContinuousCarousel";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GeneralButton } from "components/Button";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Docs.module.scss";

const Docs = () => {
  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);
  return (
    <>
      <ContinuousCarousel direction={"right"}>
        <div className={styles.carouselText}>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
          <h2>DOCUMENTATION</h2>
        </div>
      </ContinuousCarousel>
      <div className={styles.container} id="documentation">
        <ManualCarousel>
              {items.map((item) => (
                <div className={styles.docsCard}>
                  <img src={item.img}/>
                  <h3>{item.title}</h3>
                  <a href={item.link}>DOCS <i>*</i></a>
                </div>
              ))}
        </ManualCarousel>    
      </div>
      <div className={styles.desktopViewFormInput}>
        <h4>Stay hydrated</h4>
        <label>
            EMAIL
        </label>
        <div> 
          <input type="text" placeholder="elon@email.com"/>
          <GeneralButton version={"secondary"} type={"text"} size={"medium"} handleClick={function (): void {
            throw new Error("Function not implemented.");
          } }>GIMME THE JUICE
          </GeneralButton>
        </div>
      </div>
      <div className={styles.mobileViewFormInput}>
        <div>
          <h2>Stay hydrated</h2>
          <p>
            Subscribe to our monthly newsletter to stay up to date with our progress and roadmap.
          </p>
          <form>
            <div>
              <label>
                Name
              </label>
              <input type="text" placeholder="Elon"/>
              <label>
                Email
              </label>
              <input type="text" placeholder="elon@email.com"/>
            </div>
            <GeneralButton version={"primary"} type={"text"} size={"medium"} handleClick={function (): void {
            throw new Error("Function not implemented.");
          } }>GIMME THE JUICE
          </GeneralButton>
          </form>

        </div>
      </div>
    </>
  );
};

export default Docs;

const items = [
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    title: "Fluidity University Part 3: Utility Mining: A fairer token distribution strategy",
    link: "",
  },
  { 
    img: "https://picsum.photos/200/300/?blur",
    link: "",
  },
];
