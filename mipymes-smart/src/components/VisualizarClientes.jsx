import React, { useState, useEffect } from "react";

function VisualizarClientes() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [dataClientes, setDataClientes] = useState([]);
  const [estados, setEstados] = useState([]);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/getAllClientes", {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setDataClientes(data); // Almacenar la información del perfil en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/allEstados", {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setEstados(data); // Almacenar la información del perfil en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEstadoChange = async (clienteId, nuevoEstadoId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/updateEstadoCliente/${clienteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ estado: nuevoEstadoId }),
        }
      );
      if (response.ok) {
        // Actualiza el estado del cliente en el frontend
        setDataClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente._id === clienteId
              ? {
                  ...cliente,
                  estado: estados.find((e) => e._id === nuevoEstadoId), // Actualizar el estado
                }
              : cliente
          )
        );
      } else {
        console.error("Error updating estado:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating estado:", error);
    }
  };

  return (
    <div>
      <div className=" grid grid-cols-5 gap-4">
        <div
          className=" p-4 rounded-md shadow"
          style={{ backgroundColor: "#e8cbf3" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#47097d" }}>
            Clientes Totales
          </h2>
          <p className="text-3xl font-bold " style={{ color: "#47097d" }}>
            {dataClientes.length}
          </p>
        </div>
        <div
          className=" p-4 rounded-md shadow"
          style={{ backgroundColor: "#6ba8b3" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#d8e9e7" }}>
            Activos
          </h2>
          <p className="text-3xl font-bold " style={{ color: "#d8e9e7" }}>
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Activo"
              ).length
            }
          </p>
        </div>

        <div
          className=" p-4 rounded-md shadow"
          style={{ backgroundColor: "#fdd8b0" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#827597" }}>
            En proceso
          </h2>
          <p className="text-3xl font-bold " style={{ color: "#827597" }}>
            {
              dataClientes.filter(
                (cliente) =>
                  cliente.estado.estado_descripcion === "En proceso de contacto"
              ).length
            }
          </p>
        </div>
        <div
          className=" p-4 rounded-md shadow"
          style={{ backgroundColor: "#7b94de" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#15315d" }}>
            Cerrados
          </h2>
          <p className="text-3xl font-bold" style={{ color: "#15315d" }}>
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Cerrado"
              ).length
            }
          </p>
        </div>
        <div
          className=" p-4 rounded-md shadow"
          style={{ backgroundColor: "#9c1323" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#e0bdcb" }}>
            Inactivos
          </h2>
          <p className="text-3xl font-bold" style={{ color: "#e0bdcb" }}>
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Inactivo"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-2">Nombre</th>
              <th className="text-left py-2">Asesor</th>
              <th className="text-left py-2">Asesorias completas</th>
              <th className="text-left py-2">Estado</th>
            </tr>
          </thead>

          {dataClientes.map((cliente, index) => (
            <tbody key={index}>
              <tr
                className="cursor-pointer text-sm"
                onClick={() => handleRowClick(index)}
              >
                <td className="py-2">{cliente.nombre}</td>
                <td className="py-2">Pendiente</td>
                <td className="py-2">Pendiente</td>

                <td className="py-2">
                  <select
                    value={cliente.estado?._id} // Asegurarse de que el valor sea el id del estado
                    onChange={(e) =>
                      handleEstadoChange(cliente._id, e.target.value)
                    }
                    className="bg-white border border-gray-300 text-sm rounded p-1.5 pr-10 px-4"
                  >
                    {estados.map((estado) => (
                      <option key={estado._id} value={estado._id}>
                        {estado.estado_descripcion}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="4" className="py-2 bg-gray-100">
                    <div className="p-4">
                      <h3 className="font-semibold">{cliente.nombre}</h3>
                      <p>
                        Teléfono: {cliente.contacto.telefono} <br />
                        Correo: {cliente.contacto.email_cliente} <br />
                        Nombre de empresa: {cliente.nombre_empresa} <br />
                        Correo de empresa: {cliente.contacto.email_empresa}{" "}
                        <br />
                        Servicios que ofrece: {
                          cliente.descripcion_servicios
                        }{" "}
                        <br />
                        Rubro: {cliente.rubro} <br />
                        Ingresos generados mas de 8,000: {cliente.ingresos}{" "}
                        <br />
                        Servicios que necesita:{" "}
                        {cliente.servicios_requeridos.join(", ")}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}

          {/* <tbody>
            <tr
              className="cursor-pointer text-sm"
              onClick={() => handleRowClick(1)}
            >
              <td className="py-2">Cliente A</td>
              <td className="py-2">Asesor 1</td>
              <td className="py-2">1/4</td>
              <td className="py-2">Activo</td>
            </tr>
            {expandedRow === 1 && (
              <tr>
                <td colSpan="4" className="py-2 bg-gray-100">
                  <div className="p-4">
                    <h3 className="font-semibold">Cliente A</h3>
                    <p>
                      Teléfono: xxx-xxx-xxxx <br />
                      Correo: clienteA@gmail.com <br />
                      Nombre de empresa: xxxxxxxxxxxxxxxxxxxx <br />
                      Correo de empresa: correoEmpresa@gmail.com <br />{" "}
                      Servicios que ofrece: diseño de productos, etc. <br />{" "}
                      Rubro: Industrial Ingresos generados: Mayores de 8000{" "}
                      <br />
                      Servicios que necesita: Asesoria empresarial, financiera.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody> */}
        </table>
      </div>
    </div>
  );
}

export default VisualizarClientes;
