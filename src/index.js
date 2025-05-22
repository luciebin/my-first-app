import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter, NavLink, Outlet, Route, Routes } from "react-router";
import { AddForm } from "./components/AddForm";
import { Lists } from "./components/Lists";
import { Home } from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <nav
                style={{
                  display: "flex",
                  color: "black",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <NavLink to={"/"}>Domů</NavLink>
                <NavLink to={"/addForm"}>Přidej inzerát</NavLink>
                <NavLink to={"/lists"}>Inzeráty</NavLink>
              </nav>
              <Outlet></Outlet>
            </div>
          }
        >
          <Route index element={<Home />} />
          <Route path="addform" element={<AddForm />} />
          <Route path="Lists" element={<Lists />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
