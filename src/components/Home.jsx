import { useNavigate } from "react-router";
import "../css/home.css";

export const Home = () => {
  const navigate = useNavigate(); // funkce pro přesměrování uživatele

  return (
    <>
      <div className="home">
        <video
          className="home-video"
          src="/videos/volleyball.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="home-content">
          <h1>
            <span style={{ color: "#222" }}>Najdi svého</span>{" "}
            <span style={{ color: "var(--color-green)" }}>buddyho!</span>
          </h1>
          <p>
            LetsMeetOffline je místo, kde můžeš najít parťáka na jakoukoliv
            aktivitu. Chceš začít tančit? Vyrazit na hory? Jít na koncert nebo
            se chceš jen projít s další maminkou? Dej vědět, co plánuješ – nebo
            se přidej k někomu, kdo už něco chystá.
            <br />
            Přidej se. Potkej se. <br />
            Naživo.
          </p>
          <p>Spojujeme lidi, kteří se chtějí opravdu potkat.</p>
          <div className="home-buttons">
            <button
              className="home-add-button"
              onClick={() => navigate("/addform")}
            >
              Přidat inzerát
            </button>
            <button className="show-button" onClick={() => navigate("/lists")}>
              Přidat se k někomu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
