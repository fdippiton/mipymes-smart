import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [nombre, setNombre] = useState("");
  const [email_cliente, setEmail_cliente] = useState("");
  const [email_empresa, setEmail_empresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rubro, setRubro] = useState("");
  const [descripcion_servicios, setDescripcion_servicios] = useState("");
  const [conocio_CMU, setConocio_CMU] = useState("");
  const [ingresos, setIngresos] = useState("");
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();

    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      alert("Registration successful.");
      navigate("/login");
    } else {
      alert("Registration failed. Try again.");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h4>MiPymes Unphu Smart</h4>
      <h6>Register</h6>
      <input
        type="text"
        placeholder="Nombre Cliente"
        value={username}
        onChange={(ev) => setNombre(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}

export default RegisterPage;
