import React from "react";
import { useNavigate } from "react-router";
import "../css/form.css";

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
    email: "",
    date: "",
    password: "",
    message: "",
    activity: "",
  });

  const [agreement, setAgreement] = React.useState(false); //ošetří zaškrtnutí checkboxu

  const handleSubmit = (e) => {
    e.preventDefault(); //zamezí znovu načtení stránky

    //zamezí přidání prázdného textu a upozornění, že nejsou vyplněny všechna pole
    if (
      !formData.name.trim() ||
      !formData.age.trim() ||
      !formData.email.trim() ||
      !formData.date.trim() ||
      !formData.password.trim() ||
      !formData.message.trim() ||
      !formData.activity.trim()
    ) {
      alert("Vyplň prosím všechna povinná pole.");
      return;
    }

    if (!agreement) {
      alert("Musíš souhlasit se zpracováním osobních údajů.");
      return;
    }

    const newForm = {
      //uloží celý formulář do záznamu
      id: Date.now(),
      data: formData,
    };

    // Získám uložené formuláře (pokud nějaké jsou)
    const stored = JSON.parse(localStorage.getItem("formList")) || [];
    // Přidám nový záznam
    const updated = [...stored, newForm];

    // Uložím zpět do localStorage
    localStorage.setItem("formList", JSON.stringify(updated));

    //vyčistí input po odeslání
    setFormData({
      name: "",
      age: "",
      email: "",
      date: "",
      password: "",
      message: "",
      activity: "",
    });

    navigate("/lists");
  };

  return (
    <div className="addForm">
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
          <label htmlFor="password">Heslo</label>
          <input
            type="password"
            id="password"
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

        <div className="form-row">
          <label htmlFor="activity">Kategorie</label>
          <select
            id="activity"
            value={formData.activity}
            placeholder="Napiš něco o sobě a co chceš dělat"
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
            <button
              className="save-button"
              type="button"
              onClick={() =>
                setFormData({ ...formData, activity: customOption })
              }
            >
              Uložit
            </button>
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

        <div className="back-button">
          <button
            className="go-back-button"
            type="button"
            onClick={() => navigate("/")}
          >
            Zpět
          </button>
        </div>
      </form>
    </div>
  );
};
