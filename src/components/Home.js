import React from "react";
import { useNavigate } from "react-router";
import "../css/home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/*Video background*/}
      <video
        className="home-video"
        src="/videos/friends-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/*Obsah nad videem*/}
      <div className="home-content">
        <h1>
          <span style={{ color: "#222" }}>Najdi si svého</span>{" "}
          <span style={{ color: "var(--color-green)" }}>buddyho!</span>
        </h1>
        <p>
          LetsMeetOffline je místo, kde můžeš potkat parťáka na jakoukoliv
          aktivitu. Chceš začít tančit? Lézt po skalách? Chybí ti +1 na svatbu
          nebo se chceš jít jen projít s další maminkou? Dej vědět, co plánuješ.
          <br />
          Přidej se. Potkej se. <br />
          Naživo.
        </p>
        <h3>Spojujeme lidi, co se chtějí opravdu potkat.</h3>
        <div className="home-buttons">
          <button
            className="home-add-button"
            onClick={() => navigate("/addform")}
          >
            Přidat inzerát
          </button>
          <button className="show-button" onClick={() => navigate("/lists")}>
            Zobrazit inzeráty
          </button>
        </div>
      </div>
    </div>
  );
};
