import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../src/App";
import React from "react";
import CtcForm from "../src/components/CtcForm";
import Deductions from "../src/components/Deductions";
import { CtcProvider } from "../src/store/CtcContext";
import { MemoryRouter } from "react-router-dom";
import NewRegime from "../src/components/NewRegime";
import OldRegime from "../src/components/OldRegime";
import BestRegime from "../src/components/BestRegime";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

function inputAndLabelTest(label: string) {
  const userInputLabel = screen.getByLabelText(label) as HTMLInputElement;

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(userInputLabel.value).toBe("");
}

function acceptCtcFormInputFromUserTest(label: string, value: number) {
  render(
    <CtcProvider>
      <CtcForm />
    </CtcProvider>
  );

  fireEvent.change(screen.getByLabelText(label), {
    target: { value: value },
  });

  expect(screen.getByLabelText(label)).toHaveValue(value);
}

function acceptDeductionInputFromUser(label: string, value: number) {
  render(
    <CtcProvider>
      <Deductions />
    </CtcProvider>
  );

  fireEvent.change(screen.getByLabelText(label), {
    target: { value: value },
  });

  expect(screen.getByLabelText(label)).toHaveValue(value);
}

describe("Should Take Input for the Tax Calculator and display the result ", () => {
  test("should display the heading", () => {
    render(<App />);

    const searchItem = screen.getByText("Tax Calculator");

    expect(searchItem).toBeInTheDocument();
  });
  test("should display a form", () => {
    render(<App />);

    const userInputForm = screen.getByRole("form");

    expect(userInputForm).toBeTruthy();
  });

  test("should display the input and its label basic", () => {
    render(<App />);

    inputAndLabelTest("Basic");
  });
  test("should display the input and its label hra", () => {
    render(<App />);

    inputAndLabelTest("HRA");
  });
  test("should display the input and its label special allowance", () => {
    render(<App />);

    inputAndLabelTest("Special Allowance");
  });
  test("should display the input and its label Other Taxable", () => {
    render(<App />);

    inputAndLabelTest("Other Taxable");
  });

  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Basic", 500000);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Basic", 2000);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Basic", 10);
  });

  test("should accept value entered by the user for hra label", () => {
    acceptCtcFormInputFromUserTest("HRA", 200000);
  });
  test("should accept value entered by the user for hra label", () => {
    acceptCtcFormInputFromUserTest("HRA", 17);
  });
  test("should accept value entered by the user for hra label", () => {
    acceptCtcFormInputFromUserTest("HRA", 9);
  });

  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Special Allowance", 80000);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Special Allowance", 800);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Special Allowance", 8);
  });

  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Other Taxable", 500000);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Other Taxable", 2000);
  });
  test("should accept value entered by the user for basic label", () => {
    acceptCtcFormInputFromUserTest("Other Taxable", 10000);
  });

  test("should accept value entered by the user for mediclaim label", () => {
    acceptDeductionInputFromUser("Mediclaim", 30000);
  });
  test("should accept value entered by the user for mediclaim label", () => {
    acceptDeductionInputFromUser("Mediclaim", 2000);
  });
  test("should accept value entered by the user for mediclaim label", () => {
    acceptDeductionInputFromUser("Mediclaim", 300);
  });

  test("should accept value entered by the user for House Loan label", () => {
    acceptDeductionInputFromUser("House Loan", 20000);
  });
  test("should accept value entered by the user for House Loan label", () => {
    acceptDeductionInputFromUser("House Loan", 200000);
  });
  test("should accept value entered by the user for House Loan label", () => {
    acceptDeductionInputFromUser("House Loan", 200);
  });
  test("should accept value entered by the user for Education Loan label", () => {
    acceptDeductionInputFromUser("Education Loan", 50000);
  });
  test("should accept value entered by the user for Education Loan label", () => {
    acceptDeductionInputFromUser("Education Loan", 150000);
  });
  test("should accept value entered by the user for Education Loan label", () => {
    acceptDeductionInputFromUser("Education Loan", 50);
  });
  test("should accept value entered by the user for section 80C label", () => {
    acceptDeductionInputFromUser("section 80C", 12000);
  });
  test("should accept value entered by the user for section 80C label", () => {
    acceptDeductionInputFromUser("section 80C", 1200);
  });
  test("should accept value entered by the user for section 80C label", () => {
    acceptDeductionInputFromUser("section 80C", 1000);
  });
  test("should navigate to deductions route when button is clicked", () => {
    const mockNavigate = jest.fn();

    jest
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(
      <CtcProvider>
        <MemoryRouter>
          <CtcForm />
        </MemoryRouter>
      </CtcProvider>
    );

    fireEvent.change(screen.getByLabelText(/Basic/i), {
      target: { value: "50000" },
    });
    fireEvent.change(screen.getByLabelText(/HRA/i), {
      target: { value: "10000" },
    });
    fireEvent.change(screen.getByLabelText(/Special Allowance/i), {
      target: { value: "20000" },
    });
    fireEvent.change(screen.getByLabelText(/Other Taxable/i), {
      target: { value: "30000" },
    });

    fireEvent.click(screen.getByText(/Submit Salary Details/i));

    expect(mockNavigate).toHaveBeenCalledWith("/deductions");
  });
});
