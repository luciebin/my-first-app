import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../css/lists.css";

export const Lists = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const COLORS = [
    "#627a68",
    "#5d8562",
    "#af7b8c",
    "#68a2a7",
    "#927353",
    "#a5d2eb",
    "#1b7db3",
    "#b5bac1",
    "#be7322",
    "#b9844d",
    "#ae5d7a",
    "#8293ab",
    "#d7ae83",
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("formList")) || [];
    setFormList(saved);
  }, []);

  return (
    <div className="lists">
      <header className="nav-bar">
        <div className="lists-back-button">
          <button
            className="lits-go-back-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Zpět
          </button>
        </div>

        <div className="filters">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="">Všechny</option>
            <option value="Sport">Sport</option>
            <option value="Umění">Umění</option>
            <option value="Hudební akce">Hudební akce</option>
            <option value="Kurzy">Kurzy</option>
            <option value="Jiné">Jiné</option>
          </select>

          <form className="search-form">
            <label htmlFor="search"></label>
            <input
              type="text"
              id="search"
              placeholder="Hledej"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </header>
      <ul className="cards">
        {formList
          .filter((item) =>
            selectedFilter ? item.data.activity === selectedFilter : true
          )
          .filter(
            (item) =>
              item.data.activity
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.data.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
          .map((info) => {
            const randomColor =
              COLORS[Math.floor(Math.random() * COLORS.length)];
            const randomRotation = Math.floor(Math.random() * 10 - 5);
            return (
              <li
                key={info.id}
                className={`card ${info.data.activity.toLowerCase()}`}
                style={{
                  transform: `rotate(${randomRotation}deg)`,
                  backgroundColor: randomColor,
                }}
              >
                <p>{info.data.date}</p>
                <p>
                  {info.data.name}, {info.data.age}
                </p>

                <p>{info.data.activity}</p>
                <p>{info.data.message}</p>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
