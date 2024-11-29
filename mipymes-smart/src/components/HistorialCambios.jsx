import React, { useState, useEffect } from "react";

function HistorialCambios() {
  const [historial, setHistorial] = useState([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHistorial();
  }, []);
  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-3">Historial de Cambios</h2>
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
          {historial.map((registro) => (
            <tr key={registro.id} className="text-sm">
              <td className="border border-gray-300 px-4 py-2">
                {registro.usuario.nombre}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {registro.accion}
              </td>

              <td className="border border-gray-300 px-4 py-2">
                {new Date(registro.fecha).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialCambios;
