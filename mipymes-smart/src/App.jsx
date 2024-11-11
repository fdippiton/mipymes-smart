import { useState, useEffect, useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Cookies from "js-cookie";
import { UserContextProvider } from "./UserContext";
import "./App.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import AsesorDashboard from "./pages/AsesorDashboard";
import { UserContext } from "./UserContext";
// import jwtDecode from "jwt-decode";

const ProtectedRoute = ({
  element,
  isAuthenticated,
  userRole,
  requiredRole,
}) => {
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/login");
  }
  if (userRole !== requiredRole) {
    navigate("/login");
  }
  return element;
};

function App() {
  const { userInfo, authenticated } = useContext(UserContext);
  const [userRol, setUserRol] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const handleRol = () => {
  //     if (userInfo?.rol?.descripcion) {
  //       // Asegúrate de que la propiedad "descripcion" exista en "rol"
  //       console.log("Info user from app", userInfo);
  //       const user = userInfo.rol.descripcion;
  //       setUserRol(user);
  //     }
  //   };

  //   // Solo ejecuta la función si userInfo está disponible y autenticado
  //   if (authenticated && userInfo) {
  //     handleRol();
  //   }
  // }, [userInfo, authenticated]);

  useEffect(() => {
    if (userInfo?.rol?.descripcion) {
      const user = userInfo.rol.descripcion;
      setUserRol(user);
      setLoading(false);
    } else {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
      }
    }
  }, [userInfo]);

  if (loading) {
    return <div>Cargando...</div>; // Espera a que `userInfo` esté definido
  }
  console.log("Roles", userRol);
  console.log("AU", authenticated);
  console.log("userRol === 'Administrador'", userRol === "Administrador");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              isAuthenticated={authenticated}
              userRole={userRol}
              requiredRole="Administrador"
            />
          }
        />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute
              element={<ClienteDashboard />}
              isAuthenticated={authenticated}
              userRole={userRol}
              requiredRole="Cliente"
            />
          }
        />
        <Route
          path="/asesor"
          element={
            <ProtectedRoute
              element={<AsesorDashboard />}
              isAuthenticated={authenticated}
              userRole={userRol}
              requiredRole="Asesor"
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
