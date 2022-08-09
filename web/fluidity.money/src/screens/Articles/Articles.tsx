import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Articles.module.scss";

const Articles = () => {
  return (
    <div className={styles.container}>
       <div style={{width: "80%", height:  "100%", border: "1px red solid", padding: "40px 40px 40px 40px", marginRight: "40px"}}>
          <div style={{width: "100%", height:  "350px", border: "1px red solid", margin:"10px 10px 10px 10px"}}>
             
          </div>
          <h1>Introducing Fluidity</h1>
          <p>
            After months of quietly building, we are inviting everyone to help grow 
            the future of money, Fluidity is launching soon and is excited to share
            with you the future of money, Money designed to move
          </p>
          <p>8 min read ARTICLE</p>
          <TextButton colour="coloured">ALL ARTICLES</TextButton>
      </div>
      
      <div style={{marginTop: "40px", maxHeight: "500px", border: "1px red solid", overflowY: "scroll"}}>
          <div style={{margin: "0px 0 0 10px"}}>
             <h1 style={{marginBottom: "10px"}}>Attention all Fluiders. Fluidity Testnet V1 is Live</h1>
             <p style={{marginBottom: "10px"}}>
              In our previous educational posts, we have outlined the basic economics of
              a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
              through utility mininig
             </p>
             <p style={{marginBottom: "10px"}}>8 min read BLOCKCHAIN</p>
             <hr />
          </div>
          <div style={{margin: "30px 0 0 10px"}}>
             <h1 style={{marginBottom: "10px"}}>Attention all Fluiders. Fluidity Testnet V1 is Live</h1>
             <p style={{marginBottom: "10px"}}>
              In our previous educational posts, we have outlined the basic economics of
              a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
              through utility mininig
             </p>
             <p style={{marginBottom: "10px"}}>8 min read BLOCKCHAIN</p>
             <hr />
          </div>
          <div style={{margin: "30px 0 0 10px"}}>
             <h1 style={{marginBottom: "10px"}}>Attention all Fluiders. Fluidity Testnet V1 is Live</h1>
             <p style={{marginBottom: "10px"}}>
              In our previous educational posts, we have outlined the basic economics of
              a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
              through utility mininig
             </p>
             <p style={{marginBottom: "10px"}}>8 min read BLOCKCHAIN</p>
             <hr />
          </div>
          <div style={{margin: "30px 0 0 10px"}}>
             <h1 style={{marginBottom: "10px"}}>Attention all Fluiders. Fluidity Testnet V1 is Live</h1>
             <p style={{marginBottom: "10px"}}>
              In our previous educational posts, we have outlined the basic economics of
              a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
              through utility mininig
             </p>
             <p style={{marginBottom: "10px"}}>8 min read BLOCKCHAIN</p>
             <hr />
          </div>
          <div style={{margin: "30px 0 0 10px"}}>
             <h1 style={{marginBottom: "10px"}}>Attention all Fluiders. Fluidity Testnet V1 is Live</h1>
             <p style={{marginBottom: "10px"}}>
              In our previous educational posts, we have outlined the basic economics of
              a fluid Asset, from preventing cyclical transaction attacks to how the protocol distrubutes yield
              through utility mininig
             </p>
             <p style={{marginBottom: "10px"}}>8 min read BLOCKCHAIN</p>
             <hr />
          </div>
      </div>
     
    </div>
  );
};

export default Articles;
