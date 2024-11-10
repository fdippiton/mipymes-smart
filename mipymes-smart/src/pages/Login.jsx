import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Centro from "../assets/Centro.svg";
import centromipymes from "../assets/centromipymes.png";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Login() {
  const [email_cliente, setEmail_cliente] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [authenticated, setAuthenticated] = useState(false);

  async function handleLogin(ev) {
    ev.preventDefault();

    const data = {
      email_cliente,
      contrasena,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        mode: "cors",
      });

      if (response.ok) {
        setAuthenticated(true);
        console.log("Login successful");
        console.log(authenticated);
      } else {
        alert("Login failed. Try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    }
  }

  // Efecto para obtener la información del usuario después de login
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/userInfo", {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data.rol);
        // Almacenar la información del perfil en el estado
        setUserInfo(data);
        // Establecer redirección a la página de cliente
        setRedirect(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Solo llamar a fetchData si el usuario está autenticado
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  if (redirect) {
    if (userInfo.data.rol.descripcion == "Cliente") {
      return <Navigate to={"/cliente"} />;
    } else if (userInfo.data.rol.descripcion == "Administrador") {
      return <Navigate to={"/admin"} />;
    } else if (userInfo.data.rol.descripcion == "Asesor") {
      return <Navigate to={"/asesor"} />;
    }
  }

  return (
    <form className="px-16 py-8" onSubmit={handleLogin}>
      <div className="space-y-6 flex justify-center flex-col items-center">
        <div className=" border-gray-900/10 text-center">
          <Link to="/" className="logo flex justify-center py-2">
            <img
              src={Centro}
              alt="Logo"
              style={{ width: "90px", height: "50px" }}
              className=""
            />
          </Link>
          <h2 className="text-xl font-semibold text-emerald-400">
            Unphu MiPymes Smart
          </h2>
          <h2 className="text-sm font-bold text-gray-900">Iniciar sesión</h2>
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
                  value={email_cliente}
                  onChange={(ev) => setEmail_cliente(ev.target.value)}
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
        <button
          type="submit"
          className="rounded-md w-96 text-center  text-sm bg-green-700 py-1.5 px-3 font-semibold text-white shadow-sm hover:bg-verdementa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Iniciar sesión
        </button>
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
