// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import axios from "axios";
import { useEffect } from "react";
import { ManualCarousel, Text } from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import styles from "./Tweets.module.scss";
// require("dotenv").config();

const Tweets = () => {
  const instance = axios.create({
    baseURL: "https://api.twitter.com",
    withCredentials: false,
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${process.env.twitterBearerToken}`,
    },
  });

  useEffect(() => {
    instance
      .get(
        `/2/users/${process.env.fluidityID}/tweets?tweet.fields=created_at,text`
      )
      .then((response) => {
        console.log(response);
        return response.data;
      });
  }, []);

  const { width } = useViewport();
  return (
    <div className={styles.container}>
      <ManualCarousel scrollBar={width < 500 ? true : false}>
        {tweets.map((tweet, index) => (
          <div key={index} className={styles.tweetContainer}>
            <Text prominent={true}>{tweet.text}</Text>
            <div className={styles.footer}>
              <img
                src="/assets/images/socials/twitterBlue.svg"
                alt="twitter logo"
              />
              <Text size="sm">{tweet.date}</Text>
            </div>
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
