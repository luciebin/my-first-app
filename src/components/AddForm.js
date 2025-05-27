import React from "react";
import { useNavigate } from "react-router";
import "../css/addform.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const AddForm = () => {
  const navigate = useNavigate();
  const defaultItems = [
    "Vyber",
    "Sport",
    "Umění",
    "Hudební akce",
    "Kurzy",
    "Jiné",
  ];

  //možnost vlastní aktivity
  const [customOption, setCustomOption] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    date: "",
    email: "",
    password: "",
    message: "",
    activity: "",
  });

  const [agreement, setAgreement] = React.useState(false); //ošetří zaškrtnutí checkboxu

  const handleSubmit = async (e) => {
    e.preventDefault(); //zamezí znovu načtení stránky
    console.log("handleSubmit spuštěn");
    //zamezí přidání prázdného textu a upozornění, že nejsou vyplněny všechna pole
    if (
      !formData.name.trim() ||
      !formData.age.trim() ||
      !formData.date.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.message.trim() ||
      !formData.activity.trim()
    ) {
      alert("Vyplň prosím všechna povinná pole.");
      return;
    }

    if (formData.activity === "Jiné" && !customOption.trim()) {
      alert("Zadej vlastní aktivitu.");
      return;
    }

    if (!agreement) {
      alert("Musíš souhlasit se zpracováním osobních údajů.");
      return;
    }

    const finalData = {
      name: formData.name.trim(),
      age: formData.age.trim(),
      date: formData.date.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      message: formData.message.trim(),
      activity:
        formData.activity === "Jiné"
          ? customOption.trim()
          : formData.activity.trim(),
    };

    if (isNaN(parseInt(formData.age))) {
      alert("Věk musí být číslo.");
      return;
    }

    // uložení do Firestore
    try {
      await addDoc(collection(db, "formList"), {
        data: finalData,
        createdAt: new Date(),
      });

      //vyčistí input po odeslání
      setFormData({
        name: "",
        age: "",
        date: "",
        email: "",
        password: "",
        message: "",
        activity: "",
      });

      if (formData.activity === "Jiné") {
        setCustomOption("");
      }
      setAgreement(false);

      navigate("/lists");
    } catch (error) {
      console.error("Chyba při ukládání do Firestore:", error);
      alert("Nepodařilo se uložit. Zkus to znovu.");
    }
  };

  return (
    <div className="addForm">
      <div className="back-button">
        <button
          className="go-back-button"
          type="button"
          onClick={() => navigate("/")}
        >
          Zpět
        </button>
      </div>

      <form className="fill-form" onSubmit={handleSubmit}>
        <h2>Můj inzerát</h2>
        <div className="form-row">
          <label htmlFor="name">Jméno</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="age">Věk</label>
          <input
            id="age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="date">Kdy</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            min={new Date().toISOString().split("T")[0]} // dnešní datum
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Heslo</label>
          <input
            type="password"
            id="password"
            minLength={4} //zkontrolovat jestli funguje heslo
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
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
  );
};
