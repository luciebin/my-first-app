import React, { useEffect, useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "./Button";

import "../css/logSignForm.css";

export const LoginForm = ({ setShowLoginModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef(); // odkazuje na input a umožní mu např. focus.

  useEffect(() => {
    //Po načtení komponenty se automaticky nastaví kurzor do emailového pole
    emailRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    //Funkce pro přihlášení
    if (!email || !password) {
      // zabrání pokusu o přihlášení s prázdnými poli
      alert("Vyplň prosím email a heslo.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Přihlášení proběhlo úspěšně!");
      if (setShowLoginModal) setShowLoginModal(false); // 🔧 zavře modal
      // navigate("/addform"); // 🔧 přesměruje
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

      {message && <p className="message">{message}</p>}

      <Button type="submit" onClick={handleLogin}>
        Přihlásit
      </Button>

      {/* <button type="submit" onClick={(e) => signOut(auth)}>
        Odhlásit se
      </button> */}
    </div>
  );
};
