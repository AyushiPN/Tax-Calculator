import {
  StandardForm,
  Column,
  FormField,
  FormLabel,
  GridContainer,
  Row,
  TextInput,
  Button,
} from "@vp/swan";

import { useState } from "react";
import { useCtcContext } from "../store/CtcContext";
import { useNavigate } from "react-router-dom";
import { getResult } from "../ApiService";
import { Ctc } from "../constants/Ctc";

export type Deductions = {
  mediclaim?: number;
  houseLoan?: number;
  eduLoan?: number;
  section80c?: number;
};

function Deductions() {
  const { salaryData, setSalaryData } = useCtcContext();
  const ctc: Ctc = {
    basic: salaryData.basic,
    hra: salaryData.hra,
    spAllowance: salaryData.spAllowance,
    otherTaxable: salaryData.otherTaxable,
  };

  const navigate = useNavigate();

  const [deductionFormInput, setDeductionFormInput] = useState<Deductions>({
    mediclaim: 0,

    houseLoan: 0,
    eduLoan: 0,
    section80c: 0,
  });

  function handleSalaryChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    let newValue: number;

    switch (name) {
      case "mediclaim":
        newValue = value === "" ? 0 : Math.min(Number(value), 75000);
        break;
      case "houseLoan":
        if (value !== "" && Number(value) > 200000) {
          alert("Enter an amount less than 2 lakhs for House Loan");

          return;
        }
        newValue = value === "" ? 0 : Number(value);
        break;
      case "section80c":
        newValue = value === "" ? 0 : Math.min(Number(value), 150000);
        break;
      default:
        newValue = value === "" ? 0 : Number(value);
        break;
    }

    setDeductionFormInput((prevData) => ({
      ...prevData,
      [name]:
        newValue !== undefined ? newValue : prevData[name as keyof Deductions],
    }));
  }

  async function calculateTaxableAmtAfterDed(event: React.FormEvent) {
    event.preventDefault();

    try {
      console.log("this is ctc for API ", ctc);
      console.log("this is deductions for API", deductionFormInput);
      const result = await getResult(ctc, deductionFormInput);
      setSalaryData((prev) => ({ ...prev, result: result }));
      console.log("This is API response : ", result);
    } catch (error) {
      console.log(error);
    }

    navigate("/result");
  }

  async function skipDeductions() {
    setDeductionFormInput({
      mediclaim: 0,
      houseLoan: 0,
      eduLoan: 0,
      section80c: 0,
    });
    try {
      const result = await getResult(ctc, deductionFormInput);
      setSalaryData((prev) => ({ ...prev, result: result }));
      console.log("This is API response : ", result);
    } catch (error) {
      console.log(error);
    }
    navigate("/result");
  }

  return (
    <StandardForm
      variant="horizontal"
      onSubmit={calculateTaxableAmtAfterDed}
      role="form"
    >
      <GridContainer>
        <Row component={FormField}>
          <Column span={3}>
            <FormLabel htmlFor="mediclaim">Mediclaim</FormLabel>
          </Column>
          <Column span={9}>
            <TextInput
              id="mediclaim"
              name="mediclaim"
              type="number"
              onChange={handleSalaryChange}
              value={
                deductionFormInput.mediclaim === 0
                  ? ""
                  : deductionFormInput.mediclaim
              }
            />
          </Column>
        </Row>

        <Row component={FormField}>
          <Column span={3}>
            <FormLabel htmlFor="houseLoan">House Loan</FormLabel>
          </Column>
          <Column span={9}>
            <TextInput
              id="houseLoan"
              name="houseLoan"
              type="number"
              onChange={handleSalaryChange}
              value={
                deductionFormInput.houseLoan === 0
                  ? ""
                  : deductionFormInput.houseLoan
              }
            />
          </Column>
        </Row>
        <Row component={FormField}>
          <Column span={3}>
            <FormLabel htmlFor="eduLoan">Education Loan</FormLabel>
          </Column>
          <Column span={9}>
            <TextInput
              id="eduLoan"
              name="eduLoan"
              type="number"
              onChange={handleSalaryChange}
              value={
                deductionFormInput.eduLoan === 0
                  ? ""
                  : deductionFormInput.eduLoan
              }
            />
          </Column>
        </Row>
        <Row component={FormField}>
          <Column span={3}>
            <FormLabel htmlFor="section80c">section 80C</FormLabel>
          </Column>
          <Column span={9}>
            <TextInput
              id="section80c"
              name="section80c"
              type="number"
              onChange={handleSalaryChange}
              value={
                deductionFormInput.section80c === 0
                  ? ""
                  : deductionFormInput.section80c
              }
            />
          </Column>
        </Row>

        <Button type="submit" role="button" mt={4} skin="primary">
          Submit Deductions
        </Button>
        <Button type="submit" role="button" onClick={skipDeductions} mt={4}>
          Skip Adding deductions
        </Button>
      </GridContainer>
    </StandardForm>
  );
}

export default Deductions;
