// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.
import axios from "axios";
import { ManualCarousel } from "@fluidity-money/surfing";
import styles from "./Tweets.module.scss";
import { useEffect } from "react";

const Tweets = () => {
  const instance = axios.create({
    baseURL: "https://cors-anywhere.herokuapp.com/https://api.twitter.com",
    withCredentials: false,
    timeout: 1000,
    headers: {
      Authorization:
        "Bearer AAAAAAAAAAAAAAAAAAAAANadhQEAAAAADsZogDf3wzgzYezSG6biCGr%2BOjM%3DKs0pCOyCAmM6glaOFnWZUl8IU0M89tDyZDVlWjMj4LoK8b5zku",
    },
  });

  useEffect(() => {
    instance
      .get("/2/users/1372816026933424129/tweets?tweet.fields=created_at,text")
      .then((response) => {
        console.log(response);
        return response.data;
      });
  }, []);

  return (
    <div className={styles.container}>
      <ManualCarousel>
        {tweets.map((tweet, index) => (
          <div key={index} className={styles.tweetContainer}>
            <p>{tweet.text}</p>
            <div>{tweet.date}</div>
          </div>
        ))}
      </ManualCarousel>
    </div>
  );
};

export default Tweets;

const tweets = [
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
  {
    text: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga doloremque ad, possimus, nostrum voluptates commodi totam atque animi vero hic veritatis voluptas nesciunt, nisi tenetur quibusdam odio tempora magnam unde?",
    date: "7:08PM - Jun 23 2022",
  },
];
