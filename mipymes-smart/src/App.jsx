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

const ProtectedRoute = ({
  element,
  isAuthenticated,
  userRole,
  requiredRole,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    // Only navigate if not authenticated or if role doesn't match
    if (!isAuthenticated || userRole !== requiredRole) {
      navigate("/login");
    }
  }, [isAuthenticated, userRole, requiredRole, navigate]); // Dependencies array ensures effect runs when these values change

  // Only return the element if the user is authenticated and has the required role
  return isAuthenticated && userRole === requiredRole ? element : null;
};

function App() {
  const { userInfo, authenticated } = useContext(UserContext);
  const [userRol, setUserRol] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
