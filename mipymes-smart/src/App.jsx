import { useState, useEffect } from "react";
import "./App.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { UserContextProvider } from "./UserContext";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import AsesorDashboard from "./pages/AsesorDashboard";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const checkToken = () => {
  //     const token = Cookies.get("token");

  //     if (token) {
  //       const decoded = jwtDecode(token);
  //       const expirationTime = decoded.exp * 1000; // Convertir la expiración a milisegundos
  //       const currentTime = Date.now();

  //       if (currentTime >= expirationTime) {
  //         // Token expirado, realizar acciones necesarias (por ejemplo, redirigir al inicio de sesión)
  //         alert("Tu sesión ha expirado. Inicia sesión nuevamente.");
  //         handleLogout();
  //         window.location.href = "/login";
  //       } else {
  //         // Token válido, el usuario está autenticado
  //         setAuthenticated(true);
  //         setUser(decoded);
  //       }
  //     }
  //   };

  //   checkToken();
  // }, []);

  // const handleLogin = (token) => {
  //   Cookies.set("token", token, { expires: 1 }); // Establecer la cookie con una expiración de 1 día
  //   const decoded = jwtDecode(token);
  //   console.log(decoded);

  //   setAuthenticated(true);
  //   setUser(decoded);
  // };

  // const handleLogout = () => {
  //   setAuthenticated(false);
  //   setUser(null);
  //   Cookies.remove("token"); // Eliminar la cookie
  // };

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cliente" element={<ClienteDashboard />} />
          <Route path="/asesor" element={<AsesorDashboard />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
