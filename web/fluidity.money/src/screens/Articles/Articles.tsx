import React from "react";
import ArticleCard from "../../components/Article/ArticleCard";
import {ArticleList, ArticleListProps, ArticleType} from "../../components/Article/ArticleLists";
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
            info: "Test"
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
  return (
    <div className={styles.container}>
      <ArticleCard></ArticleCard>
     <ArticleList {...arr}></ArticleList>
    </div>
  );
};

export default Articles;
