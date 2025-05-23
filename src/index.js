import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { AddForm } from "./components/AddForm";
import { Lists } from "./components/Lists";
import { Home } from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addform" element={<AddForm />} />
        <Route path="lists" element={<Lists />} />
      </Routes>
    </BrowserRouter>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
