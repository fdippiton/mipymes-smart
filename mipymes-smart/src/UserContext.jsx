import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
export const UserContext = createContext({});
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (email, contrasena) => {
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        body: JSON.stringify({ email, contrasena }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAuthenticated(true);

        // setUserInfo(data); // Guarda la información del usuario si es necesario
        console.log("Login exitoso");
      } else {
        console.log("Login fallido");
        throw new Error("Login fallido: las credenciales son incorrectas.");
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error);
      // Opcionalmente, puedes lanzar el error para manejarlo en otro lugar
    }
  };

  // const token = Cookies.get("token");
  // console.log("Mi token", token);

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get("token");
      if (token) {
        try {
          setAuthenticated(true);
          const response = await fetch("http://localhost:3001/userInfo", {
            credentials: "include", // Incluir cookies en la solicitud
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          setUserInfo(data); // Almacenar la información del perfil en el estado
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [authenticated]);

  // /* ------------------------------ Manejar login ----------------------------- */
  // const handleLogin = (token) => {
  //   localStorage.setItem("accessToken", token);
  //   const decoded = jwtDecode(token);
  //   console.log(decoded);

  //   setAuthenticated(true);
  //   setUser(decoded);
  // };

  // /* ------------------------ Manejar cierre de sesion ------------------------ */
  const handleLogout = () => {
    setAuthenticated(false);
    setUserInfo({});
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  };

  return (
    <UserContext.Provider
      value={{
        handleLogin,
        handleLogout,
        userInfo,
        authenticated,
        setUserInfo,
        setAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
