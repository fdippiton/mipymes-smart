import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";

function VisualizarClientes() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [dataClientes, setDataClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const navigate = useNavigate();

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
        // Realizar la primera solicitud para obtener los estados
        const responseEstados = await fetch(
          "http://localhost:3000/allEstados",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!responseEstados.ok) {
          throw new Error("Error al obtener los estados");
        }

        const dataEstados = await responseEstados.json();
        setEstados(dataEstados); // Almacenar la información de estados en el estado

        // Realizar la segunda solicitud para obtener las asignaciones
        const responseAsignaciones = await fetch(
          "http://localhost:3000/getAllAsignaciones",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!responseAsignaciones.ok) {
          throw new Error("Error al obtener las asignaciones");
        }

        const dataAsignaciones = await responseAsignaciones.json();
        setAsignaciones(dataAsignaciones); // Almacenar la información de asignaciones en el estado
        console.log(dataAsignaciones);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/getAllAsesores", {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAsesores(data); // Almacenar la información del perfil en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleAsignarAsesor = async (cliente) => {
    console.log("Cliente: " + cliente);
    // Filtrar asesores que tienen las especialidades requeridas por el cliente
    const asesoresDisponibles = await asesores.filter((asesor) => {
      if (
        !cliente.servicios_requeridos ||
        !Array.isArray(cliente.servicios_requeridos)
      ) {
        // Si `servicios_requeridos` no existe o no es un arreglo, devolver falso y no incluir al asesor
        return false;
      }

      // Verificar que todas las especialidades del asesor incluyan cada servicio requerido por el cliente
      return cliente.servicios_requeridos.every((servicio) =>
        asesor.especialidades.includes(servicio)
      );
    });

    console.log("Asesores disponibles", asesoresDisponibles);

    // // Filtrar los asesores que aún no han alcanzado su límite de clientes
    const asesoresElegibles = asesoresDisponibles.filter(
      (asesor) => asesor.clientes_asignados.length < asesor.max_clientes
    );

    console.log("Asesores elegibles", asesoresDisponibles);

    // Si hay asesores elegibles, elegir el que tenga menos clientes asignados
    if (asesoresElegibles.length > 0) {
      const asesorSeleccionado = asesoresElegibles.reduce((prev, curr) =>
        prev.clientes_asignados.length < curr.clientes_asignados.length
          ? prev
          : curr
      );

      // Actualizar el cliente con el asesor seleccionado
      //  asignarClienteAAsesor(cliente._id, asesorSeleccionado._id);
      // console.log("Asesor seleccionado:", asesorSeleccionado._id);
      // console.log("cliente seleccionado:", cliente._id);

      const dataToUpdates = {
        clienteId: cliente._id,
        asesorId: asesorSeleccionado._id,
      };

      try {
        const response = await fetch(
          `http://localhost:3000/asignarClienteAAsesor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dataToUpdates),
          }
        );
        if (response.ok) {
          console.log(response.message);
          alert("Asesor asignado correctamente");

          // Actualizar las asignaciones para reflejar la nueva asignación
          setAsignaciones((prevAsignaciones) => [
            ...prevAsignaciones,
            {
              cliente_id: cliente,
              asesor_id: asesorSeleccionado, // Guardar la asignación
            },
          ]);
        } else {
          console.error("Error updating estado:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating estado:", error);
      }

      // // Actualizar los datos de los asesores en el estado
      // setAsesores((prevAsesores) =>
      //   prevAsesores.map((asesor) =>
      //     asesor._id === asesorSeleccionado._id
      //       ? {
      //           ...asesor,
      //           clientes_asignados: [...asesor.clientes_asignados, cliente._id],
      //         }
      //       : asesor
      //   )
      // );
    } else {
      alert("No hay asesores disponibles que cumplan con las condiciones.");
    }
  };

  // const handleAsignaAsesor = (e) => {
  //   e.preventDefault();
  //   handleAsignarAsesor(cliente);
  // }

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
                <td className="py-2  ">
                  {asignaciones.some(
                    (asignacion) => asignacion.cliente_id._id === cliente._id
                  ) ? (
                    // Si el cliente está en las asignaciones, busca el asesor y muestra un mensaje
                    <>
                      {asignaciones
                        .filter(
                          (asignacion) =>
                            asignacion.cliente_id._id === cliente._id
                        )
                        .map((asignacion) => (
                          <span
                            key={asignacion._id}
                            className="bg-green-300 p-1 rounded-md text-gray-700 px-2"
                          >
                            Cliente ya asignado a {asignacion.asesor_id.nombre}{" "}
                            {/* Aquí cambia 'asesorId' por 'asesor_id' según tu esquema */}
                          </span>
                        ))}
                    </>
                  ) : (
                    // Si el cliente no está en las asignaciones, muestra el enlace para asignar
                    <Link
                      className="bg-red-400 p-5 rounded-md text-white px-5 py-2"
                      onClick={() => handleAsignarAsesor(cliente)}
                    >
                      Asignar Asesor
                    </Link>
                  )}
                </td>
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
                  <td colSpan="4" className="py-2 bg-gray-100 text-sm">
                    <div className="p-4">
                      <h3 className="font-semibold">{cliente.nombre}</h3>
                      <p>
                        <strong>Teléfono:</strong> {cliente.contacto.telefono}{" "}
                        <br />
                        <strong>Correo:</strong>{" "}
                        {cliente.contacto.email_cliente} <br />
                        <strong>Nombre de empresa:</strong>{" "}
                        {cliente.nombre_empresa} <br />
                        <strong>Correo de empresa:</strong>{" "}
                        {cliente.contacto.email_empresa} <br />
                        <strong>Servicios que ofrece:</strong>{" "}
                        {cliente.descripcion_servicios} <br />
                        <strong>Rubro:</strong> {cliente.rubro} <br />
                        <strong>Ingresos generados mas de 8,000:</strong>{" "}
                        {cliente.ingresos} <br />
                        <strong>Servicios que necesita:</strong>{" "}
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
