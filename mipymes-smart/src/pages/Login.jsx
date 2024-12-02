import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Centro from "../assets/Centro.svg";
import centromipymes from "../assets/centromipymes.png";
import { UserContext } from "../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [userToken, setUserToken] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Manage error state
  const navigate = useNavigate();
  const {
    handleLogin,
    userInfo,
    setUserInfo,
    authenticated,
    setAuthenticated,
  } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true while the login is in process
    setError(""); // Reset error message

    try {
      // Call the login function (awaiting the response)
      await handleLogin(email, contrasena);

      // Once login is done, set loading to false
      setLoading(false);
    } catch (err) {
      setError("Login fallido. Verifica tus credenciales.");
      setLoading(false); // Reset loading state in case of an error
    }
  };

  // Redirect based on user role
  useEffect(() => {
    if (userInfo?.rol?.descripcion) {
      const role = userInfo.rol.descripcion;

      // Navigate based on the role
      if (role === "Administrador") {
        navigate("/admin");
      } else if (role === "Cliente") {
        navigate("/cliente");
      } else if (role === "Asesor") {
        navigate("/asesor");
      } else {
        navigate("/"); // Redirect to homepage if role is invalid
      }
    }
  }, [userInfo, navigate]);

  return (
    <form className="px-16 py-8 h-screen" onSubmit={handleSubmit}>
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
