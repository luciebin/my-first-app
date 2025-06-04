import React, { useEffect, useRef, useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

import { Button } from "./Button";

import "../css/logSignForm.css";

export const LoginForm = ({ setShowLoginModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Vyplň prosím email a heslo.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Přihlášení proběhlo úspěšně!");
      setTimeout(() => {
        if (setShowLoginModal) setShowLoginModal(false);
      }, 2000);
    } catch (error) {
      let msg = "Chyba při přihlášení.";
      switch (error.code) {
        case "auth/invalid-email":
          msg = "Neplatný email.";
          break;
        case "auth/user-not-found":
          msg = "Uživatel neexistuje.";
          break;
        case "auth/wrong-password":
          msg = "Nesprávné heslo.";
          break;
        case "auth/too-many-requests":
          msg = "Příliš mnoho pokusů. Zkus to později.";
          break;
        default:
          setMessage("Chyba přihlášení.");
      }
      alert(msg);
    }
  };

  return (
    <div className="login-form">
      {message && <p className="notice-message">{message}</p>}

      <div className="login-email">
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="login-pass">
        <label htmlFor="password">Heslo</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      <Button type="submit" onClick={handleLogin}>
        Přihlásit
      </Button>
    </div>
  );
};
