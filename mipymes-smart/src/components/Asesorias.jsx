import React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function Asesorias() {
  const [docAsesorias, setDocAsesorias] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado seleccionado

  // Función para alternar la expansión de una tarjeta
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get("token");
      if (!token) {
        return;
      }
      const decoded = jwtDecode(token);

      console.log(decoded);
      try {
        const response = await fetch(
          `http://localhost:3001/getAllClienteDocAsesorias/${decoded.id}`,
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDocAsesorias(data); // Almacenar la información del perfil en el estado
        console.log(docAsesorias); // Mostrar la información en la consola
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const formatFecha = (fecha) => {
    if (!fecha) return "";

    try {
      // Crear fecha y agregar un día
      const dateObj = new Date(fecha);
      dateObj.setDate(dateObj.getDate() + 1);

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "";
    }
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value); // Actualiza el estado del filtro
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Mis asesorías</h1>
      <div className="flex flex-col">
        {/* Menú desplegable para filtrar por estado */}
        <div className="container mx-auto">
          {/* Filtro por estado */}
          <div className="mb-4">
            <label htmlFor="estado" className="mr-2 text-gray-700 font-medium">
              Filtrar por estado:
            </label>
            <select
              id="estado"
              value={selectedEstado}
              onChange={handleEstadoChange}
              className="border border-slate-300 rounded px-4 py-2 text-sm bg-gray-100 cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Tarjetas de asesorías */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docAsesorias
              .filter(
                (docAsesoria) =>
                  selectedEstado === "" || docAsesoria.estado === selectedEstado
              )
              .map((asesoria) => (
                <div
                  key={asesoria._id}
                  className={`bg-white shadow-md rounded-lg transition-all duration-300 ${
                    expandedCard === asesoria._id
                      ? "md:col-span-3 lg:col-span-3"
                      : "transform hover:scale-105"
                  }`}
                >
                  {/* Tarjeta compacta: información básica */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleCard(asesoria._id)}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {asesoria.asesoria_id.nombre_asesoria}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium text-gray-600">Tema:</span>{" "}
                      {asesoria.tema_principal || "No especificado"}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span
                        className="w-4 h-4 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            asesoria.estado === "Pendiente"
                              ? "#f87171" // Rojo claro
                              : asesoria.estado === "Completada"
                              ? "#4ade80" // Verde claro
                              : "#6b7280", // Gris oscuro
                        }}
                      ></span>
                      <span className="font-medium text-gray-600 mr-1">
                        Estado:
                      </span>
                      {asesoria.estado || "No especificado"}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-600">Fecha:</span>{" "}
                      {formatFecha(asesoria.fecha) || "No especificada"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-600">Hora:</span>{" "}
                      {asesoria.hora || "No especificada"}
                    </p>
                  </div>

                  {/* Detalles expandibles */}
                  {expandedCard === asesoria._id && (
                    <div className="bg-gray-50 border-t p-6 space-y-3 text-sm">
                      <p>
                        <span className="font-medium">Fecha:</span>{" "}
                        {formatFecha(asesoria.fecha) || "No especificada"}
                      </p>
                      <p>
                        <span className="font-medium">Hora:</span>{" "}
                        {asesoria.hora || "No especificada"}
                      </p>
                      <p>
                        <span className="font-medium">Duración:</span>{" "}
                        {asesoria.duracion_sesion || "No especificada"}
                      </p>
                      <p>
                        <span className="font-medium">Temas tratados:</span>{" "}
                        {asesoria.temas_tratados || "No especificado"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Objetivos acordados:
                        </span>{" "}
                        {asesoria.objetivos_acordados || "No especificado"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Talleres recomendados:
                        </span>{" "}
                        {asesoria.talleres_recomendados || "No especificado"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Documentos compartidos:
                        </span>{" "}
                        {asesoria.documentos_compartidos || "No especificado"}
                      </p>
                      <p>
                        <span className="font-medium">
                          Observaciones adicionales:
                        </span>{" "}
                        {asesoria.observaciones_adicionales ||
                          "No especificado"}
                      </p>
                      <button
                        className="border w-52 px-10 py-3 items-center rounded-md hover:bg-gray-200 bg-gray-300"
                        onClick={() => toggleCard(null)}
                      >
                        Cerrar detalles
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asesorias;
