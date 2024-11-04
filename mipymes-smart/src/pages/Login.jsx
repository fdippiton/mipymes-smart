import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");

  // async function register(ev) {
  //   ev.preventDefault();

  //   const response = await fetch("http://localhost:3000/register", {
  //     method: "POST",
  //     body: JSON.stringify({ username, password }),
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   if (response.status === 200) {
  //     alert("Registration successful.");
  //     navigate("/login");
  //   } else {
  //     alert("Registration failed. Try again.");
  //   }
  // }

  return (
    <form className="px-16 py-8">
      <div className="space-y-6 flex justify-center flex-col items-center">
        <div className=" border-gray-900/10 text-center">
          <h2 className="text-xl font-semibold text-emerald-400">
            Unphu MiPymes Smart
          </h2>
          <h2 className="text-base/7 font-semibold text-gray-900">
            Iniciar sesión
          </h2>
        </div>

        <div className=" border-gray-900/10 h-max">
          <div className=" gap-y-8 sm:grid-cols-6">
            <div className=" sm:col-span-3">
              <div className="mb-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Correo"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={contrasena}
                  onChange={(ev) => setContrasena(ev.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-center gap-x-6">
        <Link
          type="submit"
          className="rounded-md w-96 text-center bg-emerald-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tradewind focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Iniciar sesion
        </Link>
      </div>
      <div className="text-xs text-center mt-3">
        ¿Aún no te has registrado?
        <Link to="/signup" className="ml-2 text-sky-500">
          Registrate
        </Link>
      </div>
    </form>
  );
}

export default Login;

{
  /* <form className="register" onSubmit={register}>
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
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form> */
}
