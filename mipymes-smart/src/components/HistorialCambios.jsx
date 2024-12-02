import React, { useState, useEffect } from "react";

function HistorialCambios() {
  const [historial, setHistorial] = useState([]);
  const [historialAsesores, setHistorialAsesores] = useState([]);
  const [combinedHistorial, setCombinedHistorial] = useState([]);
  const [filter, setFilter] = useState("todos"); // "todos", "historial", "asesores"

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/historial-cambios",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setHistorial(data);

        const responseHistorialAsesores = await fetch(
          "http://localhost:3001/historial-cambios-asesores",
          {
            credentials: "include", // Incluir cookies en la solicitud
          }
        );

        if (!responseHistorialAsesores.ok) {
          throw new Error("Network response was not ok");
        }

        const dataHistorialAsesores = await responseHistorialAsesores.json();
        setHistorialAsesores(dataHistorialAsesores);

        // Combinar los dos historiales
        setCombinedHistorial([...data, ...dataHistorialAsesores]);
        console.log("combinedHistorial", combinedHistorial);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHistorial();
  }, []);

  // Filtrar registros según el filtro seleccionado
  const filteredData =
    filter === "todos"
      ? combinedHistorial
      : filter === "admin"
      ? historial
      : historialAsesores;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-3">Historial de Cambios</h2>
      {/* Filtro */}
      <div className="flex space-x-4 my-4 text-sm">
        <button
          onClick={() => setFilter("todos")}
          className={`px-4 py-2 rounded ${
            filter === "todos" ? "bg-gray-300 text-black" : "bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("admin")}
          className={`px-4 py-2 rounded ${
            filter === "admin" ? "bg-gray-300 text-black" : "bg-gray-200"
          }`}
        >
          Historial de Admin
        </button>
        <button
          onClick={() => setFilter("asesores")}
          className={`px-4 py-2 rounded ${
            filter === "asesores" ? "bg-gray-300 text-black" : "bg-gray-200"
          }`}
        >
          Historial de Asesores
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-sm">
              Usuario
            </th>
            <th className="border border-gray-300 px-4 py-2  text-sm">
              Acción
            </th>
            <th className="border border-gray-300 px-4 py-2  text-sm">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredData) && filteredData.length > 0 ? (
            [...filteredData]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Ordenar por fecha descendente
              .map((registro, index) => (
                <tr key={index} className="text-sm text-gray-700">
                  <td className="border border-gray-300 px-2">
                    {registro.usuario?.nombre || "Desconocido"}
                  </td>
                  <td className="border border-gray-300 px-4">
                    {registro.accion}
                  </td>
                  <td className="border border-gray-300 px-4">
                    {registro.fecha
                      ? new Date(registro.fecha).toLocaleString()
                      : "Fecha no especificada"}
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500"
              >
                No hay registros disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialCambios;
