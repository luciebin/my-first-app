import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import "../css/lists.css";

export const Lists = () => {
  const navigate = useNavigate();
  const [formList, setFormList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    age: "",
    date: "",
    message: "",
    activity: "",
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditedData({
      name: item.name,
      age: item.age,
      date: item.date,
      message: item.message,
      activity: item.activity,
    });
  };

  const handleSaveEdit = async (id, originalPassword) => {
    const password = prompt("Zadej heslo pro úpravu:");
    if (password !== originalPassword) {
      alert("Nesprávné heslo.");
      return;
    }
    try {
      const docRef = doc(db, "formList", id);
      await updateDoc(docRef, editedData);
      setFormList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editedData } : item))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Chyba při ukládání změn:", error);
      alert("Nepodařilo se uložit změny.");
    }
  };

  // Načtení dat z Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "formList"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: doc.id,
            ...raw.data, // <<< vezmi hodnoty z vnořeného objektu "data"
            createdAt: raw.createdAt,
          };
        });
        setFormList(data);
      } catch (error) {
        console.error("Chyba při načítání z Firestore:", error);
      }
    };

    fetchData();
  }, []);

  // Mazání
  const handleDelete = async (item) => {
    const password = prompt("Zadej heslo pro smazání:");
    if (password !== item.password) {
      alert("Nesprávné heslo.");
      return;
    }

    const confirm = window.confirm("Opravdu chceš smazat tento inzerát?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "formList", item.id));
      setFormList((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      console.error("Chyba při mazání:", error);
      alert("Nepodařilo se smazat inzerát.");
    }
  };
  console.log("formList:", formList);

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
              {editingId === info.id ? (
                <>
                  <input
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                  />
                  <input
                    value={editedData.age}
                    onChange={(e) =>
                      setEditedData({ ...editedData, age: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    value={editedData.date}
                    onChange={(e) =>
                      setEditedData({ ...editedData, date: e.target.value })
                    }
                  />
                  <input
                    value={editedData.activity}
                    onChange={(e) =>
                      setEditedData({ ...editedData, activity: e.target.value })
                    }
                  />
                  <textarea
                    value={editedData.message}
                    onChange={(e) =>
                      setEditedData({ ...editedData, message: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleSaveEdit(info.id, info.password)}
                  >
                    Uložit
                  </button>
                  <button onClick={() => setEditingId(null)}>Zrušit</button>
                </>
              ) : (
                <>
                  <p>{info.date}</p>
                  <p>
                    {info.name}, {info.age}
                  </p>
                  <p>{info.activity}</p>
                  <p>{info.message}</p>
                  <button onClick={() => handleDelete(info)}>Smazat</button>
                  <button onClick={() => handleEdit(info)}>Upravit</button>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
