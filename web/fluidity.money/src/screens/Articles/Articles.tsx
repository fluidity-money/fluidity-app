// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { ArticleCard, ArticleList, ArticleListProps } from "../../components/Article";
import { useLocation } from "react-router-dom";
import styles from "./Articles.module.scss";

const Articles = () => {
   const arr: ArticleListProps = {
      articles: [
         {
            id: 0, 
            title: "Attention all Fluiders. Fluidity Testnet V1 is Live", 
            desc: `In our previous educational posts, we have outlined the basic economics of
            a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
            through utility mininig`, 
            info: "8 min read ARTICLE"
         },
         {
            id: 1, 
            title: "Attention all Fluiders. Fluidity Testnet V1 is Live", 
            desc: `In our previous educational posts, we have outlined the basic economics of
            a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
            through utility mininig`, 
            info: "8mins read Blockchain"
         },
         {
            id: 2, 
            title: "Attention all Fluiders. Fluidity Testnet V1 is Live", 
            desc: `In our previous educational posts, we have outlined the basic economics of
            a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
            through utility mininig`, 
            info: "8mins read Blockchain"
         },
         {
            id: 3, 
            title: "Attention all Fluiders. Fluidity Testnet V1 is Live", 
            desc: `In our previous educational posts, we have outlined the basic economics of
            a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
            through utility mininig`, 
            info: "8mins read Blockchain"
         },
      ]
   }

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
    <div className={styles.container} id="articles">
      <ArticleCard id={0} img={"https://picsum.photos/200/300/?blur"} title={arr.articles[0].title} desc={arr.articles[0].desc} info={arr.articles[0].info} />
      <ArticleList {...arr} />
    </div>
  );
};

export default Articles;
