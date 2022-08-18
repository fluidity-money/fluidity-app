import React from "react";
import { ArticleCard, ArticleList, ArticleListProps } from "../../components/Article";
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
  return (
    <div className={styles.container}>
      <ArticleCard id={0} img={"https://picsum.photos/200/300/?blur"} title={arr.articles[0].title} desc={arr.articles[0].desc} info={arr.articles[0].info} />
      <ArticleList {...arr} />
    </div>
  );
};

export default Articles;
