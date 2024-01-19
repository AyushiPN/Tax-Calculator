import { Route, Routes as ReactRouterRoutes } from "react-router-dom";
import CtcForm from "./components/CtcForm";
import Deductions from "./components/Deductions";
import Result from "./components/Result";

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<CtcForm />} />
      <Route path="/deductions" element={<Deductions />} />
      <Route path="/result" element={<Result />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
