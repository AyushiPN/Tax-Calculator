import axios from "axios";
import { Ctc } from "../src/constants/Ctc";
import { Deductions } from "../src/components/Deductions";

const BASE_URL = "http://localhost:3000";

export const getResult = async (ctc: Ctc, deductionsData: Deductions) => {
  try {
    const response = await axios.get(`${BASE_URL}/tax-calc`, {
      headers: {
        "ctc-header": JSON.stringify(ctc),
        "deductions-header": JSON.stringify(deductionsData),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting result:", error);
    throw error;
  }
};
