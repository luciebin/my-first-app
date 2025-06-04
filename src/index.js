import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { AddForm } from "./components/AddForm";
import { Home } from "./components/Home";
import { ListOfAd } from "./components/ListOfAd";

import "./css/index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addform" element={<AddForm />} />
        <Route path="lists" element={<ListOfAd />} />
      </Routes>
    </BrowserRouter>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
