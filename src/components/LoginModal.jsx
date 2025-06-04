import React, { useEffect, useState } from "react";

import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Button } from "./Button";

import "../css/loginModal.css";

export const LoginModal = ({ setShowLoginModal, message }) => {
  const [isLogin, setIsLogin] = useState(true);

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
        {message && <p className="modal-message">{message}</p>}

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
