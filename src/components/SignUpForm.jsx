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
    if (!email || !password) {
      alert("Vyplň e-mail i heslo.");
      return;
    }
    if (password.length < 6) {
      alert("Heslo musí mít alespoň 6 znaků.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Registrace proběhla úspěšně!");
    } catch (error) {
      let msg = "Chyba při registraci.";
      switch (error.code) {
        case "auth/email-already-in-use":
          msg = "Tento e-mail už je zaregistrován.";
          break;
        case "auth/invalid-email":
          msg = "Neplatný e-mail.";
          break;
        case "auth/weak-password":
          msg = "Heslo je příliš slabé.";
          break;
        default:
          setMessage("Chyba přihlášení.");
      }
      alert(msg);
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
