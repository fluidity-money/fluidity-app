// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
    <Text as={"xs"}>
      {numberToCommaSeparated(47976)} Total transactions
    </Text>
    <hr />
    <Text as={"xs"}>
      {numberToCommaSeparated(897)} Prizes distributed
    </Text>
    <hr />
    <Text as={"xs"}>
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
      <Text as={"sm"}>
        {description}
      </Text>
      
      { showPrizeBreakdown && <>
        {/* Prize Breakdown */}
        <Row>
          {/* Avg prize/trans */}
          <div>
            <Text as={"lg"} colour={"white"}>
              {numberToMonetaryString(12.34)}
            </Text>
            <Text as={"sm"}>
              Avg prize/trans
            </Text>
          </div>

          {/* Top prize */}
          <div>
            <Text as={"lg"} colour={"white"}>
              {numberToMonetaryString(351879)}
            </Text>
            <Text as={"sm"}>
              Avg prize/trans
            </Text>
          </div>
        </Row>
      
        {/* Expand Button */}
        <button onClick={() => !disabled && setExpanded(expanded => !expanded)}>
          <InfoSvg />
          <Text as={"sm"} >
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
