import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

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
    <div className="signup-form">
      <div className="signup-email">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>

      <div className="signup-password">
        <label htmlFor="password">Heslo</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>

      {message && <p className="message">{message}</p>}

      <button onClick={handleSignUp} disabled={loading}>
        {loading ? "Probíhá registrace..." : "Zaregistrovat se"}
      </button>
    </div>
  );
};
