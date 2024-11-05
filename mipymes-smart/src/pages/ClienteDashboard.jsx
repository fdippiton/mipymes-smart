import React, { useState } from "react";
import Asesorias from "../components/Asesorias";
import MiPerfil from "../components/MiPerfil";
import Talleres from "../components/Talleres";
import { CgProfile } from "react-icons/cg";
import { FaPersonChalkboard } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import Centro from "../assets/Centro.svg";

function ClienteDashboard() {
  const [visibleComponent, setVisibleComponent] = useState(null);

  const handleToggleComponent = (component) => {
    setVisibleComponent(visibleComponent === component ? null : component);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-gray-50 shadow-lg p-6 flex flex-col space-y-1">
        <h2 className="text-xlfont-normal mb-4">Centro MiPymes - Dashboard</h2>
        <div
          className="py-1.5 pl-2  rounded-lg text-gray-800 font-normal text-14xs cursor-pointer hover:bg-gray-200"
          onClick={() => handleToggleComponent("Mi perfil")}
        >
          <span className="flex items-center gap-2 ">
            <CgProfile className="w-4 h-4 text-gray-500" />
            Mi perfil
          </span>
        </div>
        <div
          className="py-1.5 pl-2  rounded-lg text-gray-800 font-normal text-14xs cursor-pointer hover:bg-gray-200"
          onClick={() => handleToggleComponent("Asesorias")}
        >
          <span className="flex items-center gap-2 ">
            {" "}
            <FaPersonChalkboard className="w-4 h-4 text-gray-500" />
            Asesorías
          </span>
        </div>
        <div
          className="py-1.5 pl-2  rounded-lg text-gray-800 font-normal text-14xs cursor-pointer hover:bg-gray-200"
          onClick={() => handleToggleComponent("Talleres")}
        >
          <span className="flex items-center gap-2 ">
            {" "}
            <GiTeacher className="w-4 h-4 text-gray-500" />
            Talleres
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative p-6">
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
        <div className="relative z-10">
          {visibleComponent === "Mi perfil" && <MiPerfil />}
          {visibleComponent === "Asesorias" && <Asesorias />}
          {visibleComponent === "Talleres" && <Talleres />}
        </div>
      </div>
    </div>
  );
}

export default ClienteDashboard;
