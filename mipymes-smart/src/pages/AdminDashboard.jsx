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
    <>
      <div className="h-screen flex bg-gray-100">
        {/* Sidebar */}
        <div className="w-72 bg-gray-50 shadow-lg p-7 flex flex-col space-y-1">
          <h2 className="text-xl font-normal mb-4">
            Centro MiPymes - Admin Dashboard
          </h2>
          <div
            className="py-1.5 pl-2  rounded-lg text-gray-800 font-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Visualizar clientes")}
          >
            <span className="flex items-center gap-2 ">
              <BsFillPeopleFill className="w-4 h-4 text-gray-500" />
              Visualizar clientes
            </span>
          </div>
          <div
            className="py-1.5 pl-2  rounded-lg text-gray-800 ont-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Crear asesores")}
          >
            {" "}
            <span className="flex items-center gap-2 ">
              <FaPeopleGroup className="w-4 h-4 text-gray-500" /> Crear asesores
            </span>
          </div>
          <div
            className="py-1.5 pl-2  rounded-lg text-gray-800 ont-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Metas")}
          >
            <span className="flex items-center gap-2 ">
              <GoGoal className="w-4 h-4 text-gray-500" />
              Metas
            </span>
          </div>
          <div
            className="py-1.5 pl-2  rounded-lg text-gray-800 ont-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Generar reportes")}
          >
            <span className="flex items-center gap-2 ">
              {" "}
              <BiSolidReport className="w-4 h-4 text-gray-500" />
              Generar reportes
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {visibleComponent === "Visualizar clientes" && <VisualizarClientes />}
          {visibleComponent === "Metas" && <Metas />}
          {visibleComponent === "Generar reportes" && <GenerarReportes />}
          {visibleComponent === "Crear asesores" && <CrearAsesores />}
        </div>
      </div>

      {/* Header */}

      {/* Main Dashboard */}
      {/* <div className="flex gap-x-20 px-10 flex-grow">
        <div className="flex flex-col w-80 gap-y-3">
          <div
            className="bg-white p-4 rounded-lg shadow text-sm font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Visualizar clientes")}
          >
            <span className="flex items-center gap-2 ">
              <BsFillPeopleFill className="w-6 h-6" />
              Visualizar clientes
            </span>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow text-sm font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Crear asesores")}
          >
            <span className="flex items-center gap-2">
              <FaPeopleGroup className="w-6 h-6" /> Crear asesores
            </span>
          </div>

          <div
            className="bg-white p-4 rounded-lg shadow text-sm font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Metas")}
          >
            <span className="flex items-center gap-2">
              <GoGoal className="w-6 h-6" />
              Metas
            </span>
          </div>
          <div
            className="bg-white p-4 rounded-lg shadow text-sm font-semibold cursor-pointer"
            onClick={() => handleToggleComponent("Generar reportes")}
          >
            <span className="flex items-center gap-2">
              <BiSolidReport className="w-6 h-6" />
              Generar reportes
            </span>
          </div>
        </div>
        <div className="w-full">
          {visibleComponent === "Visualizar clientes" && <VisualizarClientes />}
          {visibleComponent === "Metas" && <Metas />}
          {visibleComponent === "Generar reportes" && <GenerarReportes />}
          {visibleComponent === "Crear asesores" && <CrearAsesores />}
        </div>
      </div> */}
    </>
  );
};

export default AdminDashboard;
