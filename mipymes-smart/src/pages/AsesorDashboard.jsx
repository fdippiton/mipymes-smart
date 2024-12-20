import React, { useState } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaPeopleGroup } from "react-icons/fa6";
import Centro from "../assets/Centro.svg";
import ClientesAsignados from "../components/ClientesAsignados";
import Asesorias from "../components/Asesorias";

const AsesorDashboard = () => {
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
            Centro MiPymes - Asesor Dashboard
          </h2>
          <div
            className="py-2 border pl-2.5  rounded-md text-gray-800 font-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Clientes asignados")}
          >
            <span className="flex items-center gap-2 ">
              <BsFillPeopleFill className="w-4 h-4 text-gray-500" />
              Clientes asignados
            </span>
          </div>
          <div
            className="py-2 border pl-2.5  rounded-md text-gray-800 ont-normal text-14xs cursor-pointer hover:bg-gray-200"
            onClick={() => handleToggleComponent("Asesorias")}
          >
            {" "}
            <span className="flex items-center gap-2 ">
              <FaPeopleGroup className="w-4 h-4 text-gray-500" /> Asesorias
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
            {visibleComponent === "Clientes asignados" && <ClientesAsignados />}
            {visibleComponent === "Asesorias" && <Asesorias />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AsesorDashboard;
