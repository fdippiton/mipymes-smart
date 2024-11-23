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
import Centro from "../assets/Centro.svg";
import centromipymes from "../assets/centromipymes.png";
import Estadisticas from "../components/Estadisticas";

const AdminDashboard = () => {
  const [visibleComponent, setVisibleComponent] = useState(null);

  const handleToggleComponent = (component) => {
    setVisibleComponent(visibleComponent === component ? null : component);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className=" w-72 bg-gray-50 shadow-lg p-7 flex flex-col space-y-1">
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
        <div className="flex-grow relative p-6 ">
          {!visibleComponent && (
            <div
              className="absolute inset-0 bg-center bg-no-repeat z-0"
              style={{
                backgroundImage: `url(${Centro})`,
                opacity: 0.2,
                backgroundSize: "400px 400px",
              }}
            ></div>
          )}
          <div className="relative z-10 flex-grow ">
            {visibleComponent === "Visualizar clientes" && (
              <VisualizarClientes />
            )}
            {visibleComponent === "Metas" && <Metas />}
            {visibleComponent === "Generar reportes" && <Estadisticas />}
            {visibleComponent === "Crear asesores" && <CrearAsesores />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
