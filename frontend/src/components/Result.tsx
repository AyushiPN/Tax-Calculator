import { FlexBox } from "@vp/swan";
import BestRegime from "./BestRegime";
import NewRegime from "./NewRegime";
import OldRegime from "./OldRegime";

const Result = () => {
  return (
    <FlexBox flexDirection="column">
      <NewRegime />
      <OldRegime />
      <BestRegime />
    </FlexBox>
  );
};

export default Result;
