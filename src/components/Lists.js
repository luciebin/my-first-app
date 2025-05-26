import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import "../css/lists.css";

export const Lists = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "formList"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFormList(data);
      } catch (error) {
        console.error("Chyba při načítání z Firestore:", error);
      }
    };

    fetchData();
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
            selectedFilter ? item.activity === selectedFilter : true
          )
          .filter(
            (item) =>
              item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.message.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((info) => (
            <li key={info.id} className={`card ${info.activity.toLowerCase()}`}>
              <p>{info.date}</p>
              <p>
                {info.name}, {info.age}
              </p>
              <p>{info.activity}</p>
              <p>{info.message}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};
