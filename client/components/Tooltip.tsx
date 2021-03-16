import ReactTooltip from "react-tooltip";
import styled from "styled-components";

const Tooltip = styled(ReactTooltip)`
  /* padding: 3px 7px; */
  border-radius: 4px;
  /* font-size: 11px; */
  color: "#fff";
  border: "none !important";
`;

Tooltip.defaultProps = {
  effect: "solid",
  backgroundColor: "#50505080",
  border: true,
  textColor: "#fff"
};

export default Tooltip;
