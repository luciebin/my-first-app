import React, { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

export const LoginModal = ({ setShowLoginModal }) => {
  //komponenta, která přijímá prop setShowLoginModal, díky které můžu zavřít modal
  const [isLogin, setIsLogin] = useState(true); //určuje, jestli se zobrazuje přihlašovací (true) nebo registrační (false) formulář

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowLoginModal(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="modal">
      <div className="modal-content">
        <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
          Pro přidání inzerátu se nejdřív přihlas nebo registruj.
        </p>

        {isLogin ? <LoginForm /> : <SignUpForm />}
        <button
          onClick={() => setIsLogin(!isLogin)}
          type="button"
          className="switch-auth"
        >
          {isLogin ? "Nemáš účet? Zaregistruj se" : "Už máš účet? Přihlaš se"}
        </button>

        <button onClick={() => setShowLoginModal(false)}>Zavřít</button>
      </div>
    </div>
  );
};
