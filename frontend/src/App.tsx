import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";

import { CtcProvider } from "./store/CtcContext";

function App() {
  return (
    <CtcProvider>
      <section>
        <h1>Tax Calculator</h1>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </section>
    </CtcProvider>
  );
}

export default App;
