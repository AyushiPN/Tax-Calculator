import { FlexBox } from "@vp/swan";
import { useCtcContext } from "../store/CtcContext";

const BestRegime = () => {
  const { salaryData } = useCtcContext();

  return (
    <FlexBox data-testid="best-regime" justifyContent="center">
      {salaryData.result?.bestTaxRegime}
    </FlexBox>
  );
};

export default BestRegime;
