import React from "react";
import styled from "styled-components";
import { Flex } from "reflexbox/styled-components";

import FeaturesItem from "./FeaturesItem";
import { ColCenterH } from "./Layout";
import { Colors } from "../consts";
import Text, { H3 } from "./Text";

const Features = () => (
  <ColCenterH
    width={1}
    flex="0 0 auto"
    py={[64, 100]}
    backgroundColor={Colors.FeaturesBg}
  >
    <H3 fontSize={[26, 28]} mb={72} light>
       Features Realtors Love.
    </H3>
    <Flex
      width={1200}
      maxWidth="100%"
      flex="1 1 auto"
      justifyContent="center"
      flexWrap={["wrap", "wrap", "wrap", "nowrap"]}
    >
      <FeaturesItem title="Managing links" icon="edit">
        Create, protect and delete your links.
      </FeaturesItem>
      <FeaturesItem title="Stats" icon="zap">
        Monitor your links with detailed statistics.
      </FeaturesItem>
      <FeaturesItem title="Free &amp; open source" icon="heart">
        Create QR codes to use on signs and handouts.
      </FeaturesItem>
    </Flex>
  </ColCenterH>
);

export default Features;
