import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "../css/lists.css";

export const Lists = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("formList")) || [];
    setFormList(saved);
  }, []);

  return (
    <div className="lists">
      <header className="nav-bar">
        <div className="lists-back-button">
          <button
            className="lists-go-back-button"
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
          </select>

          <div className="search-form">
            <label htmlFor="search"></label>
            <input
              type="text"
              id="search"
              placeholder="Hledej"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          .map((info) => (
            <li
              key={info.id}
              className={`card ${info.data.activity.toLowerCase()}`}
            >
              <p>{info.data.date}</p>
              <p>
                {info.data.name}, {info.data.age}
              </p>
              <p>{info.data.activity}</p>
              <p>{info.data.message}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};
