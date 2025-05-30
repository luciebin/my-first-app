import React, { useEffect, useRef, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const LoginForm = () => {
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
      await signInWithEmailAndPassword(auth, email, password); //Volá Firebase metodu
      setMessage("Přihlášení proběhlo úspěšně!");
    } catch (error) {
      alert("Chyba přihlášení: " + error.message);
    }
  };

  return (
    <div className="login-form">
      <div className="login-email">
        <label htmlFor="email">Email</label>
        <input
          ref={emailRef}
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="login-pass">
        <label htmlFor="password">Heslo</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      {message && <p className="message">{message}</p>}

      <button type="submit" onClick={handleLogin}>
        Přihlásit
      </button>

      <button type="submit" onClick={(e) => signOut(auth)}>
        Odhlásit se
      </button>
    </div>
  );
};
