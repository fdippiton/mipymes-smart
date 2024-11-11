import { useState, useEffect, useContext } from "react";
import "./App.css";
import Layout from "./Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

import Login from "./pages/Login";
import { UserContextProvider } from "./UserContext";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import ClienteDashboard from "./pages/ClienteDashboard";
import AsesorDashboard from "./pages/AsesorDashboard";
import { UserContext } from "./UserContext";
import Cookies from "js-cookie";
// import jwtDecode from "jwt-decode";

function App() {
  return (
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
  );
}

export default App;
