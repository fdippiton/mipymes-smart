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
  const [asesorias, setAsesorias] = useState([]);
  const [docAsesorias, setDocAsesorias] = useState({});

  const [formData, setFormData] = useState({
    asesoria_id: "",
    cliente_id: "",
    asesor_id: "",
    fecha: "",
    hora: "",
    duracion_sesion: "",
    tema_principal: "",
    documentos_compartidos: "",
    temas_tratados: "",
    objetivos_acordados: "",
    talleres_recomendados: "",
    observaciones_adicionales: "",
    estado: "",
    foto: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    const clearedFormData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = key === "foto" ? null : ""; // Si es 'foto', asigna null; de lo contrario, cadena vacía
      return acc;
    }, {});

    setFormData(clearedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);

    const response = await fetch("http://localhost:3000/registrarDocAsesoria", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      alert("Asesoria creada exitosamente.");
      resetForm();
      setExpandedRowNewAsesoria(null);
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("Error en el registro. Inténtalo de nuevo.");
    }
    // Aquí puedes hacer la lógica de envío de datos (fetch o axios)
  };

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const handleAsesoriaClick = (rowId) => {
    setExpandedRowAsesoria(expandedRowAsesoria === rowId ? null : rowId);
  };

  const handleNewAsesoriaClick = (rowId, tipoAsesoria) => {
    const key = `${rowId}-${tipoAsesoria}`;
    setExpandedRowNewAsesoria(expandedRowNewAsesoria === key ? null : key);
  };

  const renderForm = (asesoria, clienteId, asesorId) => (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
    >
      <h2 className="text-base font-semibold text-gray-700">
        Nueva sesión de Asesoría
      </h2>

      {/* Fecha */}
      <div className="flex flex-col">
        <label htmlFor="fecha" className="font-medium text-sm">
          Fecha
        </label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
          required
        />
      </div>

      {/* Hora */}
      <div className="flex flex-col">
        <label htmlFor="hora" className="font-medium text-sm">
          Hora
        </label>
        <input
          type="time"
          id="hora"
          name="hora"
          value={formData.hora}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
          required
        />
      </div>

      {/* Duración */}
      <div className="flex flex-col">
        <label htmlFor="duracion_sesion" className="font-medium text-sm">
          Duración de la sesión
        </label>
        <input
          type="text"
          id="duracion_sesion"
          name="duracion_sesion"
          value={formData.duracion_sesion}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
        />
      </div>

      {/* Tema Principal */}
      <div className="flex flex-col">
        <label htmlFor="tema_principal" className="font-medium text-sm">
          Tema Principal
        </label>
        <input
          type="text"
          id="tema_principal"
          name="tema_principal"
          value={formData.tema_principal}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
        />
      </div>

      {/* Estado */}
      <div className="flex flex-col">
        <label htmlFor="estado" className="font-medium text-sm">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
          required
        >
          <option value="" className="text-sm">
            Selecciona un estado
          </option>
          <option value="Pendiente" className="text-sm">
            Pendiente
          </option>
          <option value="Completado" className="text-sm">
            Completado
          </option>
        </select>
      </div>

      {/* Observaciones */}
      {/* <div className="flex flex-col">
        <label
          htmlFor="observaciones_adicionales"
          className="font-medium text-gray-600"
        >
          Observaciones Adicionales
        </label>
        <textarea
          id="observaciones_adicionales"
          name="observaciones_adicionales"
          value={formData.observaciones_adicionales}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
          rows="4"
        ></textarea>
      </div> */}

      {/* Foto */}
      {/* <div className="flex flex-col">
        <label htmlFor="foto" className="font-medium text-gray-600">
          Foto
        </label>
        <input
          type="file"
          id="foto"
          name="foto"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
        />
      </div> */}

      {/* Botón de envío */}
      <button
        type="submit"
        className="border  bg-emerald-100 rounded-md hover:bg-emerald-200 p-3"
      >
        Guardar Asesoría
      </button>

      {/* Asesoria ID */}
      <div className="flex flex-col">
        <label
          htmlFor="asesoria_id"
          className="font-medium text-gray-600"
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        >
          Asesoría
        </label>
        <input
          type="text"
          id="asesoria_id"
          name="asesoria_id"
          value={(formData.asesoria_id = asesoria)}
          onChange={handleInputChange}
          className="border text-sm border-gray-300 bg-gray-100 rounded-md p-0"
          required
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        />
      </div>

      {/* Cliente ID */}
      <div className="flex flex-col">
        <label
          htmlFor="cliente_id"
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          className="font-medium text-gray-600"
        >
          ID del Cliente
        </label>
        <input
          type="text"
          id="cliente_id"
          name="cliente_id"
          value={(formData.cliente_id = clienteId)}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-0 focus:outline-none focus:ring focus:ring-emerald-300"
          required
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        />
      </div>

      {/* Asesor ID */}
      <div className="flex flex-col">
        <label
          htmlFor="asesor_id"
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          className="font-medium text-gray-600"
        >
          ID del Asesor
        </label>
        <input
          type="text"
          id="asesor_id"
          name="asesor_id"
          value={(formData.asesor_id = asesorId)}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-0 focus:outline-none focus:ring focus:ring-emerald-300"
          required
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        />
      </div>
    </form>
  );

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
        // console.log(dataClientes);

        const responseAsesorias = await fetch(
          "http://localhost:3000/getAllAsesorias",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!responseAsesorias.ok) {
          throw new Error("Network response was not ok");
        }

        const dataAsesorias = await responseAsesorias.json();
        // console.log(dataAsesorias);
        setAsesorias(dataAsesorias);

        const responseDocAsesorias = await fetch(
          "http://localhost:3000/getAllDocAsesorias",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!responseDocAsesorias.ok) {
          throw new Error("Network response was not ok");
        }

        const dataDocAsesorias = await responseDocAsesorias.json();
        console.log(dataDocAsesorias);
        setDocAsesorias(dataDocAsesorias);
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
        <h2 className="text-xl font-semibold mb-4">Mis clientes</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="text-left py-2 px-3">Cliente</th>
              <th className="text-left py-2 px-3">Asesorias</th>
            </tr>
          </thead>

          {dataClientes.map((cliente, index) => (
            <tbody key={index}>
              <tr className="cursor-pointer text-sm border border-gray-300 h-14">
                <td
                  className="px-3 py-2 font-normal"
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
                    className=" bg-gray-100 text-sm border border-gray-300"
                  >
                    <div className="">
                      <h3 className="pl-4  pt-4 font-normal text-base mb-5">
                        Asesorías del cliente
                      </h3>
                      <div className="space-y-2 h-fit">
                        {" "}
                        {/* Contenedor con espacio vertical entre las asesorías */}
                        {dataClientes
                          .filter((asesoria) => {
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
                              className="px-4 border shadow-md bg-gray-50"
                            >
                              <div className="mt-3 py-1 h-fit">
                                {asesoria.asesor_empresarial_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      <strong className="text-sm   rounded-md mb-0.5 block">
                                        Empresarial
                                      </strong>
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(
                                            index,
                                            "empresarial"
                                          )
                                        }
                                        className="mt-2 flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                      {expandedRowNewAsesoria ===
                                        `${index}-empresarial` && (
                                        <div className="mt-4">
                                          {renderForm(
                                            asesorias
                                              .filter(
                                                (asesoria) =>
                                                  asesoria.nombre_asesoria ===
                                                  "Asesoria Empresarial"
                                              )
                                              .map(
                                                (asesoria) => asesoria._id
                                              )[0], // Selecciona el primer _id de la asesoría que cumpla la condición
                                            cliente.cliente_id._id,
                                            asesorId
                                          )}
                                        </div>
                                      )}
                                      {/* {docAsesorias.map(
                                        (docAsesoria, index) => (
                                          <div key={index} className="mb-6">
                                            <p>
                                              Cliente en docAsesoria:{" "}
                                              {docAsesoria.cliente_id._id}
                                            </p>
                                            <p>
                                              Cliente esperado:{" "}
                                              {cliente.cliente_id._id}
                                            </p>
                                            <p>
                                              Asesor en docAsesoria:{" "}
                                              {docAsesoria.asesor_id}
                                            </p>
                                            <p>Asesor esperado: {asesorId}</p>
                                            <p>
                                              Nombre asesoría:{" "}
                                              {
                                                docAsesoria.asesoria_id
                                                  ?.nombre_asesoria
                                              }
                                            </p>
                                          </div>
                                        )
                                      )} */}
                                      <div className="flex">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            // Validar propiedades anidadas
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ==
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ==
                                                "Asesoria Empresarial"
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className=" mt-3 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6"
                                              style={{
                                                backgroundColor:
                                                  doc.estado === "Pendiente"
                                                    ? "#FADBD8"
                                                    : "#B2F7EF",
                                              }}
                                            >
                                              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                {doc.asesoria_id
                                                  ?.nombre_asesoria || "N/A"}
                                              </h3>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Tema:
                                                </span>{" "}
                                                {doc.tema_principal ||
                                                  "No especificado"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Fecha:
                                                </span>{" "}
                                                {doc.fecha || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Hora:
                                                </span>{" "}
                                                {doc.hora || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-600">
                                                  Estado:
                                                </span>{" "}
                                                {doc.estado ||
                                                  "No especificado"}
                                              </p>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                {asesoria.asesor_financiero_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      <strong className="text-sm   rounded-md mb-0.5 block">
                                        Financiera
                                      </strong>
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(
                                            index,
                                            "financiera"
                                          )
                                        }
                                        className="mt-2 flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                      {expandedRowNewAsesoria ===
                                        `${index}-financiera` && (
                                        <div className="mt-4">
                                          {renderForm(
                                            asesorias
                                              .filter(
                                                (asesoria) =>
                                                  asesoria.nombre_asesoria ===
                                                  "Asesoría Financiera"
                                              )
                                              .map(
                                                (asesoria) => asesoria._id
                                              )[0], // Selecciona el primer _id de la asesoría que cumpla la condición,
                                            cliente.cliente_id._id,
                                            asesorId
                                          )}
                                        </div>
                                      )}

                                      <div className="flex">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            // Validar propiedades anidadas
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ==
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ==
                                                "Asesoría Financiera"
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className=" mt-3 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6"
                                            >
                                              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                {doc.asesoria_id
                                                  ?.nombre_asesoria || "N/A"}
                                              </h3>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Tema:
                                                </span>{" "}
                                                {doc.tema_principal ||
                                                  "No especificado"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Fecha:
                                                </span>{" "}
                                                {doc.fecha || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Hora:
                                                </span>{" "}
                                                {doc.hora || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-600">
                                                  Estado:
                                                </span>{" "}
                                                {doc.estado ||
                                                  "No especificado"}
                                              </p>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                {asesoria.asesor_tecnologico_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="">
                                      <strong className="text-sm   rounded-md mb-0.5 block">
                                        Tecnológica
                                      </strong>
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(
                                            index,
                                            "tecnologica"
                                          )
                                        }
                                        className="mt-2 flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Nueva sesión de asesoría
                                      </button>
                                      {expandedRowNewAsesoria ===
                                        `${index}-tecnologica` && (
                                        <div className="mt-4">
                                          {renderForm(
                                            asesorias
                                              .filter(
                                                (asesoria) =>
                                                  asesoria.nombre_asesoria ===
                                                  "Asesoria Tecnológica"
                                              )
                                              .map(
                                                (asesoria) => asesoria._id
                                              )[0], // Selecciona el primer _id de la asesoría que cumpla la condición
                                            cliente.cliente_id,
                                            asesorId
                                          )}
                                        </div>
                                      )}

                                      <div className="flex">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            // Validar propiedades anidadas
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ==
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ==
                                                "Asesoria Tecnológica"
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className=" mt-3 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6"
                                            >
                                              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                {doc.asesoria_id
                                                  ?.nombre_asesoria || "N/A"}
                                              </h3>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Tema:
                                                </span>{" "}
                                                {doc.tema_principal ||
                                                  "No especificado"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Fecha:
                                                </span>{" "}
                                                {doc.fecha || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium text-gray-600">
                                                  Hora:
                                                </span>{" "}
                                                {doc.hora || "No especificada"}
                                              </p>
                                              <p className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-600">
                                                  Estado:
                                                </span>{" "}
                                                {doc.estado ||
                                                  "No especificado"}
                                              </p>
                                            </div>
                                          ))}
                                      </div>
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
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}

export default ClientesAsignados;
