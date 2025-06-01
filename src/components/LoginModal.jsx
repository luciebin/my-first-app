import React, { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

import "../css/loginModal.css";
import { Button } from "./Button";

export const LoginModal = ({ setShowLoginModal, message }) => {
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
        {message && <p className="notice-message">{message}</p>}

        {isLogin ? (
          <>
            <LoginForm setShowLoginModal={setShowLoginModal} />
            <div className="modal-switch-btn">
              <Button variant="green" onClick={() => setIsLogin(false)}>
                Nemáš účet? Zaregistruj se
              </Button>
            </div>
          </>
        ) : (
          <>
            <SignUpForm />
            <div className="modal-switch-btn">
              <Button variant="green" onClick={() => setIsLogin(true)}>
                Už máš účet? Přihlaš se
              </Button>
            </div>
          </>
        )}
        <Button
          variant="close"
          onClick={() => setShowLoginModal(false)}
          title="Zavřít"
        >
          &times;
        </Button>
      </div>
    </div>
  );
};
