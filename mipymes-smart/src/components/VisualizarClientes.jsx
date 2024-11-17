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

  // const handleAsignarAsesor = async (cliente) => {
  //   console.log("Cliente: " + cliente);
  //   // Filtrar asesores que tienen las especialidades requeridas por el cliente
  //   const asesoresDisponibles = await asesores.filter((asesor) => {
  //     if (
  //       !cliente.servicios_requeridos ||
  //       !Array.isArray(cliente.servicios_requeridos)
  //     ) {
  //       // Si `servicios_requeridos` no existe o no es un arreglo, devolver falso y no incluir al asesor
  //       return false;
  //     }

  //     // Verificar que todas las especialidades del asesor incluyan cada servicio requerido por el cliente
  //     return cliente.servicios_requeridos.every((servicio) =>
  //       asesor.especialidades.includes(servicio)
  //     );
  //   });

  //   console.log("Asesores disponibles", asesoresDisponibles);

  //   // // Filtrar los asesores que aún no han alcanzado su límite de clientes
  //   const asesoresElegibles = asesoresDisponibles.filter(
  //     (asesor) => asesor.clientes_asignados.length < asesor.max_clientes
  //   );

  //   console.log("Asesores elegibles", asesoresDisponibles);

  //   // Si hay asesores elegibles, elegir el que tenga menos clientes asignados
  //   if (asesoresElegibles.length > 0) {
  //     const asesorSeleccionado = asesoresElegibles.reduce((prev, curr) =>
  //       prev.clientes_asignados.length < curr.clientes_asignados.length
  //         ? prev
  //         : curr
  //     );

  //     // Actualizar el cliente con el asesor seleccionado
  //     //  asignarClienteAAsesor(cliente._id, asesorSeleccionado._id);
  //     // console.log("Asesor seleccionado:", asesorSeleccionado._id);
  //     // console.log("cliente seleccionado:", cliente._id);

  //     const dataToUpdates = {
  //       clienteId: cliente._id,
  //       asesorId: asesorSeleccionado._id,
  //     };

  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/asignarClienteAAsesor`,
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           credentials: "include",
  //           body: JSON.stringify(dataToUpdates),
  //         }
  //       );
  //       if (response.ok) {
  //         console.log(response.message);
  //         alert("Asesor asignado correctamente");

  //         // Actualizar las asignaciones para reflejar la nueva asignación
  //         setAsignaciones((prevAsignaciones) => [
  //           ...prevAsignaciones,
  //           {
  //             cliente_id: cliente,
  //             asesor_id: asesorSeleccionado, // Guardar la asignación
  //           },
  //         ]);
  //       } else {
  //         console.error("Error updating estado:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Error updating estado:", error);
  //     }

  //     // // Actualizar los datos de los asesores en el estado
  //     // setAsesores((prevAsesores) =>
  //     //   prevAsesores.map((asesor) =>
  //     //     asesor._id === asesorSeleccionado._id
  //     //       ? {
  //     //           ...asesor,
  //     //           clientes_asignados: [...asesor.clientes_asignados, cliente._id],
  //     //         }
  //     //       : asesor
  //     //   )
  //     // );
  //   } else {
  //     alert("No hay asesores disponibles que cumplan con las condiciones.");
  //   }
  // };

  // const handleAsignaAsesor = (e) => {
  //   e.preventDefault();
  //   handleAsignarAsesor(cliente);
  // }

  const handleAsignarAsesor = async (cliente) => {
    // console.log("Cliente: ", cliente);
    const asignadosTemporalmente = new Set();

    const asignarAsesorEquitativo = (asesoresDisponibles) => {
      if (asesoresDisponibles.length === 0) return null;

      return asesoresDisponibles.reduce((prev, curr) => {
        if (!prev) return curr;

        const isPrevAssigned = asignadosTemporalmente.has(prev._id);
        const isCurrAssigned = asignadosTemporalmente.has(curr._id);

        if (isPrevAssigned && !isCurrAssigned) return curr;
        if (!isPrevAssigned && isCurrAssigned) return prev;

        const totalPrev =
          prev.clientes_encuentros.length +
          prev.clientes_asignados.length +
          (isPrevAssigned ? 1 : 0);
        const totalCurr =
          curr.clientes_encuentros.length +
          curr.clientes_asignados.length +
          (isCurrAssigned ? 1 : 0);

        if (totalPrev === totalCurr) {
          return prev.id < curr.id ? prev : curr;
        }

        return totalPrev < totalCurr ? prev : curr;
      }, null);
    };

    const asesoresDisponiblesEmpresarial = asesores.filter(
      (asesor) =>
        asesor.especialidades.includes("Asesoría Empresarial") &&
        asesor.clientes_encuentros.length < asesor.max_encuentros
    );

    const asesoresDisponiblesFinanciero = asesores.filter(
      (asesor) =>
        asesor.especialidades.includes("Asesoría Financiera") &&
        asesor.clientes_encuentros.length < asesor.max_encuentros
    );

    const asesoresDisponiblesTecnologico = asesores.filter(
      (asesor) =>
        asesor.especialidades.includes("Asesoría Tecnologica") &&
        asesor.clientes_encuentros.length < asesor.max_encuentros
    );

    let asesorEmpresarial = asignarAsesorEquitativo(
      asesoresDisponiblesEmpresarial
    );
    if (asesorEmpresarial) asignadosTemporalmente.add(asesorEmpresarial._id);

    let asesorFinanciero = asignarAsesorEquitativo(
      asesoresDisponiblesFinanciero
    );
    if (asesorFinanciero) asignadosTemporalmente.add(asesorFinanciero._id);

    let asesorTecnologico = asignarAsesorEquitativo(
      asesoresDisponiblesTecnologico
    );
    if (asesorTecnologico) asignadosTemporalmente.add(asesorTecnologico._id);

    console.log("Asesor empresarial " + asesorEmpresarial?.nombre);
    console.log("Asesor financiero " + asesorFinanciero?.nombre);
    console.log("Asesor tecnológico " + asesorTecnologico?.nombre);

    const asesoresElegiblesDefinitivos = asesores.filter((asesor) => {
      const serviciosCumplidos = cliente.servicios_requeridos.filter(
        (servicio) => asesor.especialidades.includes(servicio)
      ).length;

      return (
        serviciosCumplidos >=
        Math.floor(cliente.servicios_requeridos.length / 2)
      );
    });

    console.log(
      "Asesores elegibles definitivos:",
      asesoresElegiblesDefinitivos
    );

    let asesorDefinitivo = null;

    if (asesoresElegiblesDefinitivos.length > 0) {
      asesorDefinitivo = asesoresElegiblesDefinitivos.reduce((prev, curr) => {
        const prevLoad =
          prev.clientes_encuentros.length +
          prev.clientes_asignados.length +
          (asignadosTemporalmente.has(prev._id) ? 1 : 0);
        const currLoad =
          curr.clientes_encuentros.length +
          curr.clientes_asignados.length +
          (asignadosTemporalmente.has(curr._id) ? 1 : 0);

        return prevLoad < currLoad ? prev : curr;
      });
    } else {
      const asesoresCombinados = asesoresDisponiblesEmpresarial.concat(
        asesoresDisponiblesFinanciero,
        asesoresDisponiblesTecnologico
      );

      asesorDefinitivo = asignarAsesorEquitativo(asesoresCombinados);
    }

    if (asesorDefinitivo) {
      asignadosTemporalmente.add(asesorDefinitivo._id);
    }

    console.log(
      "Asesor definitivo asignado:",
      asesorDefinitivo?.nombre || "N/A"
    );

    // Verificar si se asignaron todos los asesores
    if (
      asesorEmpresarial &&
      asesorFinanciero &&
      asesorTecnologico &&
      asesorDefinitivo
    ) {
      const dataToUpdate = {
        clienteId: cliente._id,
        asesorEmpresarialId: asesorEmpresarial._id,
        asesorFinancieroId: asesorFinanciero._id,
        asesorTecnologicoId: asesorTecnologico._id,
        asesorDefinitivoId: asesorDefinitivo._id,
      };

      try {
        const response = await fetch(
          `http://localhost:3000/asignarClienteAAsesor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dataToUpdate),
          }
        );

        if (response.ok) {
          console.log("Asignación exitosa", response.message);
          alert("Asesores asignados correctamente");

          // Actualizar las asignaciones para reflejar la nueva asignación
          setAsignaciones((prevAsignaciones) => [
            ...prevAsignaciones,
            {
              cliente_id: cliente._id,
              asesor_empresarial_id: asesorEmpresarial._id,
              asesor_financiero_id: asesorFinanciero._id,
              asesor_tecnologico_id: asesorTecnologico._id,
              asesor_definitivo_id: asesorDefinitivo._id,
            },
          ]);
        } else {
          console.error("Error al actualizar estado:", response.statusText);
        }
      } catch (error) {
        console.error("Error al actualizar estado:", error);
      }
    } else {
      alert("No hay asesores disponibles que cumplan con las condiciones.");
    }
  };

  return (
    <div>
      <div className=" grid grid-cols-5 gap-4">
        <div
          className=" p-4 rounded-md shadow bg-gray-300"
          // style={{ backgroundColor: "#e8cbf3" }}
        >
          <h2
            className="text-xl font-semibold text-gray-500"
            // style={{ color: "#47097d" }}
          >
            Clientes Totales
          </h2>
          <p
            className="text-3xl font-bold text-gray-500"
            // style={{ color: "#47097d" }}
          >
            {dataClientes.length}
          </p>
        </div>
        <div
          className=" p-4 rounded-md shadow bg-emerald-400"
          // style={{ backgroundColor: "#6ba8b3" }}
        >
          <h2
            className="text-xl font-semibold text-emerald-700"
            // style={{ color: "#d8e9e7" }}
          >
            Activos
          </h2>
          <p
            className="text-3xl font-bold text-emerald-700"
            // style={{ color: "#d8e9e7" }}
          >
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Activo"
              ).length
            }
          </p>
        </div>

        <div
          className=" p-4 rounded-md shadow bg-yellow-400"
          // style={{ backgroundColor: "#fdd8b0" }}
        >
          <h2
            className="text-xl font-semibold text-yellow-600"
            // style={{ color: "#827597" }}
          >
            En proceso
          </h2>
          <p
            className="text-3xl font-bold text-yellow-600"
            // style={{ color: "#827597" }}
          >
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
              <th className="text-left py-2 ">Asesores</th>
              <th className="text-left py-2">Asesorias completas</th>
              <th className="text-left py-2">Estado</th>
            </tr>
          </thead>

          {dataClientes.map((cliente, index) => (
            <tbody key={index}>
              <tr
                className="cursor-pointer text-sm border border-gray-300 "
                onClick={() => handleRowClick(index)}
              >
                <td className="px-2 py-2 font-semibold">{cliente.nombre}</td>
                <td className="py-2  gap-2">
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
                            className="flex flex-col space-y-2 w-fit"
                          >
                            <strong className=" bg-green-300 p-1 rounded-md text-gray-700 px-2">
                              Asesoría empresarial:{" "}
                              {asignacion.asesor_empresarial_id?.nombre ||
                                "No asignado"}
                            </strong>
                            <strong className=" bg-green-300 p-1 rounded-md text-gray-700 px-2">
                              Asesoría financiera:{" "}
                              {asignacion.asesor_financiero_id?.nombre ||
                                "No asignado"}
                            </strong>
                            <strong className=" bg-green-300 p-1 rounded-md text-gray-700 px-2">
                              Asesoría tecnológica:{" "}
                              {asignacion.asesor_tecnologico_id?.nombre ||
                                "No asignado"}
                            </strong>
                            <strong className=" bg-blue-300 p-1 rounded-md text-gray-700 px-2">
                              Asesor definitivo:{" "}
                              {asignacion.asesor_definitivo_id?.nombre ||
                                "No asignado"}
                            </strong>
                          </span>
                        ))}
                    </>
                  ) : (
                    // Si el cliente no está en las asignaciones, muestra el enlace para asignar
                    <Link
                      className="bg-gray-300 p-5 rounded-md text-black px-5 py-2"
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
                  <td
                    colSpan="4"
                    className="py-2 bg-gray-100 text-sm border border-gray-300"
                  >
                    <div className="p-4">
                      <h3 className="font-bold">{cliente.nombre}</h3>
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
                        <strong>
                          Ingresos generados son más de $8,000 pesos:
                        </strong>{" "}
                        {cliente.ingresos} <br />
                        <strong>Servicios que necesita:</strong>{" "}
                        {Array.isArray(cliente.servicios_requeridos)
                          ? cliente.servicios_requeridos.map(
                              (servicio, index) => (
                                <span
                                  key={index}
                                  className="my-1 inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {servicio}
                                </span>
                              )
                            )
                          : typeof cliente.servicios_requeridos === "string"
                          ? cliente.servicios_requeridos
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
                        {/* {cliente.servicios_requeridos.join(", ")} */}
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
