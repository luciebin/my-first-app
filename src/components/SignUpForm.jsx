import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "./Button";

import "../css/logSignForm.css";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    //Funkce, která se spustí po kliknutí na tlačítko „Zaregistrovat se“
    if (!email || !password) {
      alert("Vyplň e-mail i heslo.");
      return;
    }
    if (password.length < 6) {
      alert("Heslo musí mít alespoň 6 znaků.");
      return;
    }

    try {
      // slouží k ošetření chyb
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password); //Používá Firebase funkci pro vytvoření účtu
      setMessage("Registrace proběhla úspěšně!");
    } catch (error) {
      alert("Chyba registrace: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="login-email">
        <label htmlFor="email">Email</label>
        <input
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="login-pass">
        <label htmlFor="password">Heslo</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      {message && <p className="message">{message}</p>}

      <Button onClick={handleSignUp} disabled={loading}>
        {loading ? "Probíhá registrace..." : "Zaregistrovat se"}
      </Button>
    </div>
  );
};
