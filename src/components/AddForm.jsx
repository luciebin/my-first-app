import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { LoginModal } from "./LoginModal";

import "../css/addform.css";
import "../css/loginModal.css";

export const AddForm = () => {
  const navigate = useNavigate();
  const [customOption, setCustomOption] = useState(""); //možnost vybrat vlastní aktivitu
  const [agreement, setAgreement] = useState(false); //ošetří zaškrtnutí checkboxu
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    //objekt se všemi základními poli formuláře
    name: "",
    age: "",
    date: "",
    message: "",
    activity: "",
  });

  const defaultItems = [
    //moje nabídka kategorií
    "Vyber",
    "Sport",
    "Umění",
    "Hudební akce",
    "Kurzy",
    "Jiné",
  ];

  //VALIDACE
  const isFormValid = () => {
    //funkce na kontrolu vyplnění polí (pokud ne - false, pokud ano - true)
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
    // vyčistí všechna pole i checkbox
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
    // hlavní funkce, která se spustí po kliknutí na „Odeslat“
    e.preventDefault(); //zamezí znovu načtení stránky

    if (!user) {
      // kontrola, že je uživatel přihlášený
      alert("Musíš být přihlášen.");
      return;
    }

    if (!isFormValid()) {
      // spustí se validace – pokud něco chybí, uživatel je upozorněn.
      alert("Zkontroluj všechna pole a souhlas.");
      return;
    }

    const finalData = {
      // připraví se data, která se uloží do Firestore. Uživatel se přidá jako email a uid
      ...formData,
      activity: formData.activity === "Jiné" ? customOption : formData.activity,
      email: user.email,
      uid: user.uid,
    };

    //ULOŽENÍ do Firestore
    try {
      await addDoc(collection(db, "formList"), {
        //Přidá nový dokument do databáze (kolekce formList)
        ...finalData,
        createdAt: new Date(),
      });

      // vyčistí formulář a přesměruje uživatele na seznam inzerátů.
      resetForm();
      navigate("/lists");
    } catch (error) {
      console.error("Chyba při ukládání do Firestore:", error);
      alert("Nepodařilo se uložit. Zkus to znovu.");
    }
  };

  useEffect(() => {
    //Sleduje, jestli je uživatel přihlášený, pokud ne → otevře modal
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setShowLoginModal(!currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {showLoginModal && ( //Pokud je showLoginModal true → zobrazí se LoginModal...
        <div className="modal">
          <LoginModal setShowLoginModal={setShowLoginModal} />
        </div>
      )}
      {/* ...Jinak se zobrazí formulář*/}
      <div className={`addForm ${showLoginModal ? "blur" : ""}`}>
        <div className="nav-bar-form">
          <div className="back-button">
            <button
              className="go-back-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Zpět
            </button>
          </div>

          {!user && (
            <>
              <div className="login-button-container">
                <button
                  className="login-button"
                  onClick={() => setShowLoginModal(true)}
                >
                  Přihlásit se
                </button>
              </div>
              {/* {showLoginModal && (
                <LoginModal setShowLoginModal={setShowLoginModal} />
              )} */}
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
              min={new Date().toISOString().split("T")[0]} // dnešní datum
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
            <button className="add-button" type="submit">
              Odeslat
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
