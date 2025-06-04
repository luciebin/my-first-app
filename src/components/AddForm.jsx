import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { LoginModal } from "./LoginModal";
import { Button } from "./Button";

import "../css/addform.css";
import "../css/loginModal.css";

export const AddForm = () => {
  const navigate = useNavigate();
  const [customOption, setCustomOption] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    date: "",
    message: "",
    activity: "",
  });

  const defaultItems = [
    "Vyber",
    "Sport",
    "Umění",
    "Hudební akce",
    "Kurzy",
    "Jiné",
  ];

  //VALIDACE
  const isFormValid = () => {
    if (
      !formData.name.trim() ||
      !formData.age.trim() ||
      !formData.date.trim() ||
      !formData.message.trim() ||
      !formData.activity.trim()
    )
      return false;

    if (formData.activity === "Jiné" && !customOption.trim()) return false;
    if (!agreement) return false;
    if (isNaN(parseInt(formData.age))) return false;

    return true;
  };

  //RESET
  const resetForm = () => {
    setFormData({
      name: "",
      age: "",
      date: "",
      message: "",
      activity: "",
    });
    setCustomOption("");
    setAgreement(false);
  };

  //ODESLÁNÍ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Musíš být přihlášen.");
      return;
    }
    if (!isFormValid()) {
      alert("Zkontroluj všechna pole a souhlas.");
      return;
    }

    const finalData = {
      ...formData,
      activity: formData.activity === "Jiné" ? customOption : formData.activity,
      email: user.email,
      uid: user.uid,
    };

    //ULOŽENÍ do Firestore
    try {
      await addDoc(collection(db, "formList"), {
        ...finalData,
        createdAt: new Date(),
      });

      resetForm();
      navigate("/lists");
    } catch (error) {
      console.error("Chyba při ukládání do Firestore:", error);
      alert("Nepodařilo se uložit. Zkus to znovu.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setShowLoginModal(!currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {showLoginModal && (
        <div className="modal">
          <LoginModal setShowLoginModal={setShowLoginModal} />
        </div>
      )}
      <div className={`addForm ${showLoginModal ? "blur" : ""}`}>
        <div className="nav-bar-form">
          <div className="back-button">
            <Button onClick={() => navigate("/")}>Zpět</Button>
          </div>

          {!user && (
            <>
              <div className="login-button-container">
                <Button onClick={() => setShowLoginModal(true)}>
                  Přihlásit se
                </Button>
              </div>
            </>
          )}
        </div>

        <form className="fill-form" onSubmit={handleSubmit}>
          <h2>Můj inzerát</h2>
          <div className="form-row">
            <label htmlFor="name">Jméno</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="age">Věk</label>
            <input
              id="age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="date">Kdy</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <label htmlFor="message">Zpráva</label>
            <textarea
              id="message"
              value={formData.message}
              placeholder="Napiš něco o sobě a co chceš dělat"
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            />
          </div>

          <div className="form-row-category">
            <label htmlFor="activity">Kategorie</label>
            <select
              id="activity"
              value={formData.activity}
              onChange={(e) =>
                setFormData({ ...formData, activity: e.target.value })
              }
            >
              {defaultItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {formData.activity === "Jiné" && (
            <div className="form-choose">
              <input
                value={customOption}
                onChange={(e) => setCustomOption(e.target.value)}
                placeholder="Zadej vlastní aktivitu"
              />
            </div>
          )}

          <div className="checkbox">
            <input
              type="checkbox"
              name="agreement"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
            />
            <label>Souhlasím se zpracováním osobních údajů</label>
          </div>

          <div className="form-button">
            <Button variant="green" type="submit">
              Odeslat
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
