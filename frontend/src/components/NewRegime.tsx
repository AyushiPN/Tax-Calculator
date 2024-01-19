import { useCtcContext } from "../store/CtcContext";

import { FlexBox } from "@vp/swan";

const NewRegime = () => {
  const { salaryData } = useCtcContext();

  console.log("new regime tax in new regime", salaryData.result?.newRegimeTax);

  return (
    <FlexBox justifyContent="space-between">
      <span> New Regime Tax Payable is : </span>
      <span data-testid="new-regime-tax">
        {salaryData.result?.newRegimeTax}
      </span>
    </FlexBox>
  );
};

export default NewRegime;
