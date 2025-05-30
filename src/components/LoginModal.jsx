import React, { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

import "../css/loginModal.css";

export const LoginModal = ({ setShowLoginModal }) => {
  //komponenta, která přijímá prop setShowLoginModal, díky které můžu zavřít modal
  const [isLogin, setIsLogin] = useState(true); //určuje, jestli se zobrazuje přihlašovací (true) nebo registrační (false) formulář

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowLoginModal(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setShowLoginModal]);

  return (
    <div className="modal">
      <div className="modal-content">
        <p>Pro přidání inzerátu se nejdřív přihlas nebo registruj</p>

        {isLogin ? (
          <>
            <LoginForm setShowLoginModal={setShowLoginModal} />
            <div className="modal-switch-btn">
              <button
                onClick={() => setIsLogin(false)}
                type="button"
                className="switch-auth"
              >
                Nemáš účet? Zaregistruj se
              </button>
            </div>
          </>
        ) : (
          <>
            <SignUpForm />
            <div className="modal-switch-btn">
              <button
                onClick={() => setIsLogin(true)}
                type="button"
                className="switch-auth"
              >
                Už máš účet? Přihlaš se
              </button>
            </div>
          </>
        )}
        <button
          className="close-button"
          onClick={() => setShowLoginModal(false)}
          title="Zavřít"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
