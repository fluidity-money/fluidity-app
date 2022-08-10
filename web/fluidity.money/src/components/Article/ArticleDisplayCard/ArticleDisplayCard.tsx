import React from 'react'
import PropTypes from 'prop-types'

import { TextButton } from "../../Button";

const ArticleDisplayCard = ({ }) => {

    return (
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
    );
};

export default ArticleDisplayCard;