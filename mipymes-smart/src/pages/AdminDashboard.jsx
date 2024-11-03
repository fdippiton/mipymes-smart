import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillPeopleFill } from "react-icons/bs";
import { GoGoal } from "react-icons/go";
import { BiSolidReport } from "react-icons/bi";
import { FaPeopleGroup } from "react-icons/fa6";
import VisualizarClientes from "../components/VisualizarClientes";
import Metas from "../components/Metas";
import GenerarReportes from "../components/GenerarReportes";
import CrearAsesores from "../components/CrearAsesores";

const AdminDashboard = () => {
  const [visibleComponent, setVisibleComponent] = useState(null);

  const handleToggleComponent = (component) => {
    setVisibleComponent(visibleComponent === component ? null : component);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Centro MiPymes - Admin Dashboard
        </h1>
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Configuración
        </button> */}
      </header>

      {/* Main Dashboard */}
      <div className="flex gap-x-20 px-10">
        <div className="flex flex-col w-80 gap-y-3">
          <div
            className="bg-white p-4 rounded-lg shadow text-lg font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Visualizar clientes")}
          >
            <span className="flex items-center gap-2">
              <BsFillPeopleFill />
              Visualizar clientes
            </span>
          </div>

          <div
            className="bg-white p-4 rounded-lg shadow text-lg font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Metas")}
          >
            <span className="flex items-center gap-2">
              <GoGoal />
              Metas
            </span>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow text-lg font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Generar reportes")}
          >
            <span className="flex items-center gap-2">
              <BiSolidReport />
              Generar reportes
            </span>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow text-lg font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Crear asesores")}
          >
            <span className="flex items-center gap-2">
              <FaPeopleGroup /> Crear asesores
            </span>
          </div>
          {/* Metric Panels */}
          {/* <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Clientes Totales</h2>
          <p className="text-3xl font-bold text-blue-500">320</p>
        </div> */}
        </div>
        <div className="w-full">
          {visibleComponent === "Visualizar clientes" && <VisualizarClientes />}
          {visibleComponent === "Metas" && <Metas />}
          {visibleComponent === "Generar reportes" && <GenerarReportes />}
          {visibleComponent === "Crear asesores" && <CrearAsesores />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
