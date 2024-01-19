import { useCtcContext } from "../store/CtcContext";
import { FlexBox } from "@vp/swan";

const OldRegime = () => {
  const { salaryData } = useCtcContext();

  return (
    <FlexBox justifyContent="space-between">
      <span>Old Regime Tax Payable is: </span>

      <span data-testid="old-regime-tax">
        {salaryData.result?.oldRegimeTax}
      </span>
    </FlexBox>
  );
};

export default OldRegime;
