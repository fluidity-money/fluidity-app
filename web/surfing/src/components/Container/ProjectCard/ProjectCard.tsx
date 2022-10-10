// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";
import { ReactComponent as InfoSvg } from "~/assets/images/buttonIcons/infoCircle.svg";
import { Card, Heading, Row, Text } from "~/components";
import { numberToMonetaryString, numberToCommaSeparated } from "~/util";
import styles from "./ProjectCard.module.scss";

interface IProjectCard {
  project: string;
  size: "lg" | "md" | "sm" | "xs";
  icon: string;
  description: string;
  className: string;
  disabled?: boolean;
}

const ProjectCard = ({icon, project, description, className, size, disabled}: IProjectCard ) => {
  const [expanded, setExpanded] = useState(false)
  const showPrizeBreakdown = ["lg", "md"].includes(size);
  const expandedProp = expanded || styles.expanded;

  const classProps = className || "";
  
  const PrizeBreakdown = () => (
    <>
    <Text size={"xs"}>
      {numberToCommaSeparated(47976)} Total transactions
    </Text>
    <hr />
    <Text size={"xs"}>
      {numberToCommaSeparated(897)} Prizes distributed
    </Text>
    <hr />
    <Text size={"xs"}>
      {32}% Prize probability
    </Text>
    </>
  )

  return (
    <Card 
      component={"button"}
      className={`${styles.project} ${styles[size]} ${expandedProp} ${classProps}`} 
      rounded={true}
      type={"gray"}
    >
      {/* Icon */}
      <img src={icon} />

      {/* Heading */}
      <Heading as={"h4"}>
        {project}
      </Heading>

      {/* Description */}
      <Text size={"sm"}>
        {description}
      </Text>
      
      { showPrizeBreakdown && <>
        {/* Prize Breakdown */}
        <Row>
          {/* Avg prize/trans */}
          <div>
            <Text size={"lg"} prominent={true}>
              {numberToMonetaryString(12.34)}
            </Text>
            <Text size={"sm"}>
              Avg prize/trans
            </Text>
          </div>

          {/* Top prize */}
          <div>
            <Text size={"lg"} prominent={true}>
              {numberToMonetaryString(351879)}
            </Text>
            <Text size={"sm"}>
              Avg prize/trans
            </Text>
          </div>
        </Row>
      
        {/* Expand Button */}
        <button onClick={() => !disabled && setExpanded(expanded => !expanded)}>
          <InfoSvg />
          <Text size={"sm"} >
            Prize breakdown
          </Text>
        </button>

        {/* Prize breakdown */}
        {expanded && <PrizeBreakdown />}
      </> 
      }
    </Card>
  );
};

export default ProjectCard;
