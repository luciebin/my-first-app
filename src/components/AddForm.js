import React from "react";
import { useNavigate } from "react-router";

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
  const [form, setForm] = React.useState([]); //pole pro všechny odeslané záznamy.
  const [customOption, setCustomOption] = React.useState("Other"); //možnost vlastní aktivity
  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    email: "",
    date: "",
    password: "",
    message: "",
    activity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault(); //zamězí znovu načtení stránky

    if (!formData.name.trim()) return; //zamezí přidání prázdného textu

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
    navigate("/lists");

    setForm((prev) => {
      const updated = [...prev, newForm]; //přidá nový záznam do pole form
      navigate("/lists", { state: form }); //přenáším data
      return updated;
    });

    setFormData({
      name: "",
      age: "",
      email: "",
      date: "",
      password: "",
      message: "",
      activity: "",
    }); //vyčistí input po odeslání
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
              <option key={item}>{item}</option>
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
                setFormData({ ...formData, acitivty: customOption })
              }
            >
              Uložit
            </button>
          </div>
        )}

        <label>
          <input type="checkbox" name="agreement" value="1" />
        </label>
        <div className="form-button">
          <button className="add-button" type="submit">
            Odeslat
          </button>
        </div>
      </form>

      {/* <!-- <form class="search-form">
      <label for="search">Vyhledej</label>
      <input type="text" id="search" />
    </form> --> */}
    </div>
  );
};
