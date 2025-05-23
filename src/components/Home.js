import React from "react";
import { useNavigate } from "react-router";
import "../css/home.css";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Najdi si svého buddyho!</h1>
      <h2>Spojujeme lidi, co se chtějí opravdu potkat.</h2>
      <h3>
        LetsMeetOffline je místo, kde si lidé dávají výzvy, plány a inzeráty na
        reálné akce – koncerty, sport, procházky, cokoliv. Napiš, co chceš
        podniknout. Najdi parťáka. A hlavně – potkej se. Naživo.
      </h3>
      <p>
        Ahoj, vítám tě na místě, kde můžeš potkat parťáka na jakoukoliv
        aktivitu. Chceš začít tančit? Lézt po skalách? Chybí ti +1 na svatbu
        nebo se chceš jít jen projít s další maminkou? Dej vědět, co plánuješ.
        Přidej se. Potkej se.
      </p>
      <div className="home-buttons">
        <button onClick={() => navigate("/addform")}>Přidat inzerát</button>
        <button onClick={() => navigate("/lists")}>Zobrazit inzeráty</button>
      </div>
    </div>
  );
};
