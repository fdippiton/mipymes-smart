import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { IoIosAddCircle } from "react-icons/io";

function ClientesAsignados() {
  const [dataClientes, setDataClientes] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRowAsesoria, setExpandedRowAsesoria] = useState(null);
  const [expandedRowNewAsesoria, setExpandedRowNewAsesoria] = useState(null);
  const [asesorId, setAsesorId] = useState(null);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const handleAsesoriaClick = (rowId) => {
    setExpandedRowAsesoria(expandedRowAsesoria === rowId ? null : rowId);
  };

  const handleNewAsesoriaClick = (rowId) => {
    setExpandedRowNewAsesoria(expandedRowNewAsesoria === rowId ? null : rowId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get("token");
      const decoded = jwtDecode(token);
      setAsesorId(decoded.id); // Guardar el ID del asesor en el estado

      try {
        const response = await fetch(
          "http://localhost:3000/getAllAsesorClientes",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDataClientes(data); // Almacenar la información del perfil en el estado
        console.log(dataClientes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {" "}
      {/* Clients List */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="text-left py-2 px-3">Nombre</th>
              <th className="text-left py-2 px-3">Asesorias</th>
            </tr>
          </thead>

          {dataClientes.map((cliente, index) => (
            <tbody key={index}>
              <tr className="cursor-pointer text-sm border border-gray-300 h-14">
                <td
                  className="px-3 py-2 font-semibold"
                  onClick={() => handleRowClick(index)}
                >
                  {cliente.cliente_id.nombre}
                </td>
                <td>
                  <Link
                    className="border border-gray-400 p-2 rounded-md"
                    onClick={() => handleAsesoriaClick(index)}
                  >
                    Ver asesorias
                  </Link>
                </td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-2 bg-gray-100 text-sm border border-gray-300"
                  >
                    <div className="p-4">
                      <h3 className="font-bold">{cliente.cliente_id.nombre}</h3>
                      <p>
                        <strong>Teléfono:</strong>{" "}
                        {cliente.cliente_id.contacto.telefono} <br />
                        <strong>Correo:</strong>{" "}
                        {cliente.cliente_id.contacto.email_cliente} <br />
                        <strong>Nombre de empresa:</strong>{" "}
                        {cliente.cliente_id.nombre_empresa} <br />
                        <strong>Correo de empresa:</strong>{" "}
                        {cliente.cliente_id.contacto.email_empresa} <br />
                        <strong>Servicios que ofrece:</strong>{" "}
                        {cliente.cliente_id.descripcion_servicios} <br />
                        <strong>Rubro:</strong> {cliente.cliente_id.rubro}{" "}
                        <br />
                        <strong>
                          Ingresos generados son más de $8,000 pesos:
                        </strong>{" "}
                        {cliente.cliente_id.ingresos} <br />
                        <strong>Servicios que necesita:</strong>{" "}
                        {Array.isArray(cliente.cliente_id.servicios_requeridos)
                          ? cliente.cliente_id.servicios_requeridos.map(
                              (servicio, index) => (
                                <span
                                  key={index}
                                  className="my-1 inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {servicio}
                                </span>
                              )
                            )
                          : typeof cliente.cliente_id.servicios_requeridos ===
                            "string"
                          ? cliente.cliente_id.servicios_requeridos
                              .trim()
                              .split(",")
                              .map((servicio, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {servicio}
                                </span>
                              ))
                          : "No especificadas"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {expandedRowAsesoria === index && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-2 bg-gray-100 text-sm border border-gray-300"
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-xl mb-5">
                        Asesorías del cliente
                      </h3>
                      <div className="space-y-5 h-fit">
                        {" "}
                        {/* Contenedor con espacio vertical entre las asesorías */}
                        {dataClientes
                          .filter((asesoria) => {
                            // Filtrar solo las asesorías relacionadas con este asesor
                            return (
                              (asesoria.asesor_empresarial_id === asesorId &&
                                asesoria.cliente_id === cliente.cliente_id) ||
                              (asesoria.asesor_financiero_id === asesorId &&
                                asesoria.cliente_id === cliente.cliente_id) ||
                              (asesoria.asesor_tecnologico_id === asesorId &&
                                asesoria.cliente_id === cliente.cliente_id)
                            );
                          })
                          .map((asesoria) => (
                            <div
                              key={asesoria._id}
                              className="p-4 border rounded-md shadow-md bg-gray-50"
                            >
                              <div className="mt-3 py-3 h-fit">
                                {asesoria.asesor_empresarial_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      <strong className="bg-gray-200 p-2 rounded-md mb-0.5 block">
                                        Empresarial
                                      </strong>
                                      <br />
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(index)
                                        }
                                        className="flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                    </div>
                                  )}
                                {asesoria.asesor_financiero_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      <strong className="bg-gray-200 p-2 rounded-md mb-0.5 block">
                                        Financiera
                                      </strong>
                                      <br />
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(index)
                                        }
                                        className="flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                    </div>
                                  )}
                                {asesoria.asesor_tecnologico_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="">
                                      <strong className="bg-gray-200 p-1 rounded-md mb-0.5 block">
                                        Tecnológica
                                      </strong>
                                      <br />
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(index)
                                        }
                                        className="flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {expandedRowNewAsesoria === index && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-2 bg-gray-100 text-sm border border-gray-300"
                  >
                    <div className="p-4">Hello</div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

export default ClientesAsignados;
