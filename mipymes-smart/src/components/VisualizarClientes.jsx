import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAddCircle } from "react-icons/io";
import { FaUndoAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdExpandMore } from "react-icons/md";

function VisualizarClientes() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [dataClientes, setDataClientes] = useState([]);
  const [dataClientesParametros, setDataClientesParametros] = useState([]);
  const [estados, setEstados] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Texto de búsqueda ingresado por el usuario
  const [clientesFiltrados, setClientesFiltrados] = useState([]); // Resultados filtrados
  const [clientesFiltradosEstados, setClientesFiltradosEstados] = useState([]); // Resultados filtrados
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null); // Cliente seleccionado
  const [clientesEnProceso, setClientesEnProceso] = useState([]);
  const [clientesActivos, setClientesActivos] = useState([]);
  const [clientesInactivos, setClientesInactivos] = useState([]);
  const [clientesCerrados, setClientesCerrados] = useState([]);
  const [notificarUsuario, setNotificarUsuario] = useState(false);

  const navigate = useNavigate();

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/getAllClientes", {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDataClientes(data); // Almacenar la información del perfil en el estado
        setDataClientesParametros(data); //
        console.log("estado", clientesActivos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleClienteEstado = (estadoCliente) => {
    // Filtrar clientes según el estado proporcionado
    const clientesEstado = dataClientes.filter(
      (cliente) => cliente.estado.estado_descripcion === estadoCliente
    );

    // Actualizar el estado con los clientes filtrados
    setClientesFiltradosEstados(clientesEstado);
  };

  const resetClientesFiltradosEstados = () => {
    setClientesFiltradosEstados(dataClientes);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Realizar la primera solicitud para obtener los estados
        const responseEstados = await fetch(
          "http://localhost:3001/allEstados",
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
          "http://localhost:3001/getAllAsignaciones",
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
        `http://localhost:3001/updateEstadoCliente/${clienteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ estado: nuevoEstadoId }),
        }
      );
      if (response.ok) {
        // Actualiza el estado del cliente en el frontend
        setClientesFiltradosEstados((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente._id === clienteId
              ? {
                  ...cliente,
                  estado: estados.find((e) => e._id === nuevoEstadoId), // Actualizar el estado
                }
              : cliente
          )
        );

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

        const currCliente = clientesFiltrados.find((c) => c._id === clienteId);

        // Si el estado se cambia a "Activo", se ejecuta el envío de correo
        const estadoActivo = estados.find(
          (estado) => estado.estado_descripcion === "Activo"
        );
        console.log(estadoActivo);

        if (estadoActivo && nuevoEstadoId === estadoActivo._id) {
          // Si el estado es "Activo", enviar el correo automáticamente
          await handleEnviarCorreo(currCliente);
        }
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
        const response = await fetch("http://localhost:3001/getAllAsesores", {
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

  // Actualizar los resultados filtrados cuando cambia el texto de búsqueda
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtrados = dataClientes.filter(
      (cliente) => cliente.nombre.toLowerCase().startsWith(query) // Coincidencia exacta desde el inicio
    );
    setClientesFiltrados(filtrados);
  }, [searchQuery, dataClientes]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Actualiza el texto de búsqueda
    setClienteSeleccionado(null); // Limpiar cliente seleccionado al buscar
  };

  const handleClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente); // Guarda el cliente seleccionado
    setSearchQuery(""); // Limpia la barra de búsqueda
    setClientesFiltrados([]); // Limpia los resultados
  };

  const handleAsignarAsesor = async (cliente) => {
    if (cliente.estado.estado_descripcion !== "Activo") {
      alert("No es posible asignarle asesores a cliente que no esta activo.");
    } else {
      const fetchAsignaciones = async () => {
        try {
          const responseAsignaciones = await fetch(
            "http://localhost:3001/getAllAsignaciones",
            {
              credentials: "include", // Incluir cookies en la solicitud
            }
          );
          const data = await responseAsignaciones.json();
          setAsignaciones(data);
        } catch (error) {
          console.error("Error al obtener asignaciones:", error);
        }
      };

      try {
        const response = await fetch(
          "http://localhost:3001/asignarClienteAAsesor",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clienteId: cliente._id }),
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        const result = await response.json();
        console.log("asignaciones", asignaciones);

        if (response.ok) {
          // console.log("Asignación exitosa:", result);
          alert("Asignación realizada exitosamente.");
          // Reflejar la asignación en la lista
          fetchAsignaciones();
        } else {
          console.error("Error del servidor:", result.error);
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al comunicarse con el servidor.");
      }
    }
  };

  const handleDeshacerAsignacion = async (clienteId) => {
    console.log("Deshacer", clienteId);
    try {
      const response = await fetch(
        `http://localhost:3001/deshacerAsignacion/${clienteId}`,
        {
          method: "DELETE",
          credentials: "include", // Incluir cookies en la solicitud
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Asignación eliminada:", result);

        // Actualizar el estado para reflejar la eliminación
        setAsignaciones((prevAsignaciones) =>
          prevAsignaciones.filter(
            (asignacion) => asignacion.cliente_id?._id !== clienteId
          )
        );

        alert("Asignación eliminada exitosamente.");
      } else {
        const error = await response.json();
        console.error("Error del servidor:", error.message);
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error al comunicarse con el servidor:", error);
      alert("Error al eliminar la asignación.");
    }
  };

  const handleEnviarCorreo = async (cliente) => {
    try {
      const respuesta = await fetch(`http://localhost:3001/enviar-correo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cliente.contacto.email_cliente,
          nombre: cliente.nombre,
        }),
      });

      if (respuesta.ok) {
        alert("Correo enviado exitosamente al cliente.");
        setNotificarUsuario(true);
      } else {
        const errorData = await respuesta.json(); // Capturamos la respuesta de error
        console.error("Error del servidor:", errorData);
        alert(`Error al enviar el correo: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error de red al enviar el correo:", error);
      alert("Error de red al enviar el correo. Verifique la conexión.");
    }
  };

  return (
    <div>
      {/* Estadisticas top */}
      <div className="grid grid-cols-5 gap-4">
        <div
          className="rounded-md shadow cursor-pointer"
          onClick={resetClientesFiltradosEstados}
        >
          <h2
            className="rounded-md text-xl font-semibold p-4 h-28 "
            style={{ backgroundColor: "#A8DADC" }}
          >
            Clientes Totales
          </h2>
          <p className="text-3xl font-bold text-center py-2">
            {dataClientes.length}
          </p>
        </div>
        <div
          onClick={() => handleClienteEstado("Activo")}
          className="rounded-md shadow cursor-pointer"
        >
          <h2
            className="rounded-md text-xl font-semibold p-4 h-28"
            style={{ color: "white", backgroundColor: "#457B9D" }}
          >
            Activos
          </h2>
          <p className="text-3xl font-bold text-center py-2">
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Activo"
              ).length
            }
          </p>
        </div>
        <div
          onClick={() => handleClienteEstado("En proceso de contacto")}
          className="rounded-md shadow cursor-pointer"
        >
          <h2 className="rounded-md text-xl font-semibold p-4 h-28 bg-blue-800 text-white">
            En proceso
          </h2>
          <p className="text-3xl font-bold text-center py-2">
            {
              dataClientes.filter(
                (cliente) =>
                  cliente.estado.estado_descripcion === "En proceso de contacto"
              ).length
            }
          </p>
        </div>
        <div
          onClick={() => handleClienteEstado("Cerrado")}
          className="rounded-md shadow cursor-pointer"
        >
          <h2 className="rounded-md text-xl font-semibold p-4 h-28 bg-gray-200">
            Cerrados
          </h2>
          <p className="text-3xl font-bold text-center py-2">
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Cerrado"
              ).length
            }
          </p>
        </div>
        <div
          onClick={() => handleClienteEstado("Inactivo")}
          className="rounded-md shadow cursor-pointer"
        >
          <h2
            className="rounded-md text-xl font-semibold p-4 h-28"
            style={{ color: "white", backgroundColor: "#E63946" }}
          >
            Inactivos
          </h2>
          <p className="text-3xl font-bold text-center py-2">
            {
              dataClientes.filter(
                (cliente) => cliente.estado.estado_descripcion === "Inactivo"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative w-full mb-4 mt-8">
        {/* Ícono de búsqueda */}
        <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />

        {/* Campo de entrada */}
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 pl-10 border text-sm border-gray-300 rounded-md"
        />
      </div>

      {/* <input
        type="text"
        placeholder={`Buscar cliente...`}
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 border text-sm border-gray-300 rounded-md mb-4 mt-8"
      /> */}

      {/* Lista dinámica de clientes */}
      {searchQuery && clientesFiltrados.length > 0 ? (
        <ul className="border border-gray-300 rounded-md shadow-md">
          {clientesFiltrados.map((cliente) => (
            <li
              key={cliente._id} // Asegúrate de que `_id` exista en tus datos
              onClick={() => handleClienteSeleccionado(cliente)} // Seleccionar cliente
              className="p-2 cursor-pointer hover:bg-gray-100 border-b"
            >
              {cliente.nombre}
            </li>
          ))}
        </ul>
      ) : searchQuery ? (
        <p className="text-gray-500">No se encontraron coincidencias</p>
      ) : null}

      {/* Mostrar información del cliente seleccionado */}
      {clienteSeleccionado && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md shadow-md">
          <div className="p-4">
            <h3 className="font-bold">{clienteSeleccionado.nombre}</h3>
            <div className="flex justify-between">
              <div className="py-2  gap-2">
                <h6 className="text-sm font-bold mb-2">Asesores</h6>
                {clienteSeleccionado &&
                asignaciones.some(
                  (asignacion) =>
                    asignacion.cliente_id &&
                    asignacion.cliente_id._id === clienteSeleccionado._id
                ) ? (
                  <>
                    {asignaciones
                      .filter(
                        (asignacion) =>
                          asignacion.cliente_id &&
                          asignacion.cliente_id._id === clienteSeleccionado._id
                      )
                      .map((asignacion) => (
                        <div key={asignacion._id} className="">
                          <span className="flex flex-col space-y-2 w-fit text-xs">
                            <strong className="bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                              Asesoría empresarial:{" "}
                              {asignacion.asesor_empresarial_id?.nombre ||
                                "No asignado"}
                            </strong>
                            <strong className="bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                              Asesoría financiera:{" "}
                              {asignacion.asesor_financiero_id?.nombre ||
                                "No asignado"}
                            </strong>
                            <strong className="bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                              Asesoría tecnológica:{" "}
                              {asignacion.asesor_tecnologico_id?.nombre ||
                                "No asignado"}
                            </strong>
                          </span>
                          <button
                            onClick={() =>
                              handleDeshacerAsignacion(clienteSeleccionado?._id)
                            }
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white mt-3 border border-gray-300 text-sm rounded p-1.5 pr-10 px-4"
                          >
                            <FaUndoAlt className="mr-2" />
                            Deshacer Asignación
                          </button>
                        </div>
                      ))}
                  </>
                ) : (
                  <button
                    className="bg-gray-300 mt-3 border border-gray-300 hover:bg-gray-400 text-sm rounded p-1.5 px-4"
                    onClick={() => handleAsignarAsesor(clienteSeleccionado)}
                  >
                    Asignar Asesor
                  </button>
                )}
              </div>

              <div className="py-2">
                <h6 className="text-sm font-bold mb-2">Estado</h6>

                <select
                  value={clienteSeleccionado.estado?._id} // Asegurarse de que el valor sea el id del estado
                  onChange={(e) => {
                    const nuevoEstadoId = e.target.value;

                    // Actualiza el estado del cliente en la base de datos
                    handleEstadoChange(clienteSeleccionado._id, nuevoEstadoId);

                    // Actualiza el cliente seleccionado localmente
                    setClienteSeleccionado((prevCliente) => ({
                      ...prevCliente,
                      estado: estados.find(
                        (estado) => estado._id === nuevoEstadoId
                      ), // Actualiza el estado
                    }));
                  }}
                  className="bg-white border border-gray-300 text-sm rounded p-1.5 pr-10 px-4"
                >
                  {estados.map((estado) => (
                    <option key={estado._id} value={estado._id}>
                      {estado.estado_descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p>
              <h6 className="text-sm font-bold mb-2 mt-4">
                Informacion del cliente
              </h6>
              <div className="text-sm">
                <strong>Teléfono:</strong>{" "}
                {clienteSeleccionado.contacto.telefono} <br />
                <strong>Correo:</strong>{" "}
                {clienteSeleccionado.contacto.email_cliente} <br />
                <strong>Nombre de empresa:</strong>{" "}
                {clienteSeleccionado.nombre_empresa} <br />
                <strong>Correo de empresa:</strong>{" "}
                {clienteSeleccionado.contacto.email_empresa} <br />
                <strong>Servicios que ofrece:</strong>{" "}
                {clienteSeleccionado.descripcion_servicios} <br />
                <strong>Rubro:</strong> {clienteSeleccionado.rubro} <br />
                <strong>
                  Ingresos generados son más de $8,000 pesos:
                </strong>{" "}
                {clienteSeleccionado.ingresos} <br />
                <strong>Servicios que necesita:</strong>{" "}
              </div>
              {Array.isArray(clienteSeleccionado.servicios_requeridos)
                ? clienteSeleccionado.servicios_requeridos.map(
                    (servicio, index) => (
                      <span
                        key={index}
                        className="my-1 inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {servicio}
                      </span>
                    )
                  )
                : typeof clienteSeleccionado.servicios_requeridos === "string"
                ? clienteSeleccionado.servicios_requeridos
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
        </div>
      )}

      {/* Detalles del cliente seleccionado */}

      {/* Clients List */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="text-left py-2 px-3">Nombre</th>
              <th className="text-left py-2 px-3">Asesores</th>
              <th className="text-left py-2 px-3">Estado</th>
            </tr>
          </thead>

          {clientesFiltradosEstados.map((cliente, index) => (
            <tbody key={index}>
              <tr className="cursor-pointer text-sm border border-gray-300 ">
                <td
                  className="px-3 py-2 font-semibold"
                  onClick={() => handleRowClick(index)}
                >
                  <div className="flex items-center border border-slate-300 p-0.5 rounded-md mr-5">
                    <MdExpandMore className="px-2 h-8 w-8" />
                    <span className="">{cliente.nombre}</span>
                  </div>
                </td>
                <td className="py-2  gap-2 ">
                  {asignaciones.some(
                    (asignacion) => asignacion?.cliente_id?._id === cliente._id
                  ) ? (
                    // Si el cliente está en las asignaciones, busca el asesor y muestra un mensaje
                    <>
                      {asignaciones
                        .filter(
                          (asignacion) =>
                            asignacion?.cliente_id?._id === cliente._id
                        )
                        .map((asignacion) => (
                          <div>
                            <span
                              key={asignacion._id}
                              className="flex flex-col space-y-2 w-fit"
                            >
                              <strong className="text-xs bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                                Asesoría empresarial:{" "}
                                {asignacion.asesor_empresarial_id?.nombre ||
                                  "No asignado"}
                              </strong>
                              <strong className="text-xs bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                                Asesoría financiera:{" "}
                                {asignacion.asesor_financiero_id?.nombre ||
                                  "No asignado"}
                              </strong>
                              <strong className="text-xs bg-emerald-100 text-emerald-800 p-0.5 rounded-md px-2">
                                Asesoría tecnológica:{" "}
                                {asignacion.asesor_tecnologico_id?.nombre ||
                                  "No asignado"}
                              </strong>
                            </span>
                            <button
                              onClick={() =>
                                cliente?._id &&
                                handleDeshacerAsignacion(cliente._id)
                              }
                              className=" flex items-center bg-red-500 hover:bg-red-600 text-white mt-3 border border-gray-300 text-sm rounded p-1.5 pr-10 px-4"
                            >
                              {" "}
                              <FaUndoAlt className="mr-2" />
                              Deshacer Asignación
                            </button>
                          </div>
                        ))}
                    </>
                  ) : (
                    // Si el cliente no está en las asignaciones, muestra el enlace para asignar
                    <button
                      className="bg-gray-300 border border-gray-300 hover:bg-gray-400 text-sm rounded p-1.5 px-4"
                      onClick={() => handleAsignarAsesor(cliente)}
                    >
                      Asignar Asesor
                    </button>
                  )}
                </td>

                <td className="py-2 flex justify-between">
                  <select
                    value={cliente.estado?._id} // Asegurarse de que el valor sea el id del estado
                    onChange={(e) =>
                      handleEstadoChange(cliente._id, e.target.value)
                    } // Llamar a la función para cambiar el estado
                    className="bg-white border border-gray-300 text-sm rounded p-1.5 pr-10 px-4"
                  >
                    {estados.map((estado) => (
                      <option key={estado._id} value={estado._id}>
                        {estado.estado_descripcion}
                      </option>
                    ))}
                  </select>
                  {/* Mostrar el botón solo si el estado es "Activo" */}

                  {/* {cliente.estado?.estado_descripcion === "Activo" &&
                    notificarUsuario === false && (
                      <button
                        onClick={() => handleEnviarCorreo(cliente)}
                        className="mr-6 bg-emerald-500 border border-gray-300 text-white text-sm rounded p-1.5 px-4 hover:bg-emerald-600"
                      >
                        Notificar cliente
                      </button>
                    )} */}
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
