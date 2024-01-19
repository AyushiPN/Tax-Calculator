import {
  Column,
  FormField,
  FormLabel,
  GridContainer,
  Row,
  StandardForm,
  TextInput,
  Button,
} from "@vp/swan";
import "../styles/style.css";
import { useCtcContext } from "../store/CtcContext";
import { useNavigate } from "react-router-dom";

const CtcForm = () => {
  const { salaryData, setSalaryData } = useCtcContext();

  const navigate = useNavigate();

  function handleCtcSubmit(event: React.FormEvent) {
    event.preventDefault();

    navigate("/deductions");
  }

  return (
    <div className="salary-input-container">
      <StandardForm
        variant="horizontal"
        className="salary-input-form"
        role="form"
        onSubmit={handleCtcSubmit}
      >
        <GridContainer>
          <Row component={FormField}>
            <Column span={3}>
              <FormLabel htmlFor="basic">Basic</FormLabel>
            </Column>
            <Column span={9}>
              <TextInput
                id="basic"
                name="basic"
                type="number"
                onChange={(e) =>
                  setSalaryData((prev) => ({ ...prev, basic: +e.target.value }))
                }
                required
                value={salaryData.basic === 0 ? "" : salaryData.basic}
              />
            </Column>
          </Row>
          <Row component={FormField}>
            <Column span={3}>
              <FormLabel htmlFor="hra">HRA</FormLabel>
            </Column>
            <Column span={9}>
              <TextInput
                id="hra"
                type="number"
                name="hra"
                onChange={(e) =>
                  setSalaryData((prev) => ({ ...prev, hra: +e.target.value }))
                }
                required
                value={salaryData.hra === 0 ? "" : salaryData.hra}
              />
            </Column>
          </Row>
          <Row component={FormField}>
            <Column span={3}>
              <FormLabel htmlFor="sp">Special Allowance</FormLabel>
            </Column>
            <Column span={9}>
              <TextInput
                id="sp"
                type="number"
                name="spAllowance"
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    spAllowance: +e.target.value,
                  }))
                }
                required
                value={
                  salaryData.spAllowance === 0 ? "" : salaryData.spAllowance
                }
              />
            </Column>
          </Row>
          <Row component={FormField}>
            <Column span={3}>
              <FormLabel htmlFor="other">Other Taxable</FormLabel>
            </Column>
            <Column span={9}>
              <TextInput
                id="other"
                type="number"
                name="otherTaxable"
                onChange={(e) =>
                  setSalaryData((prev) => ({
                    ...prev,
                    otherTaxable: +e.target.value,
                  }))
                }
                required
                value={
                  salaryData.otherTaxable === 0 ? "" : salaryData.otherTaxable
                }
              />
            </Column>
          </Row>

          <Button mt={4} type="submit" role="button" skin="primary">
            Submit Salary Details
          </Button>
        </GridContainer>
      </StandardForm>
    </div>
  );
};

export default CtcForm;
