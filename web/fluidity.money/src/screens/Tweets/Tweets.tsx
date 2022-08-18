import React from "react";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./Tweets.module.scss";

const Tweets = () => {
  return (
    <div className={styles.container}>
      <ManualCarousel>
        {tweets.map((tweet) => (
          <div className={styles.tweetContainer}>
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
