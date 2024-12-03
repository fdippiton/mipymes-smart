import React, { useState, useEffect } from "react";

export default function Metas() {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await fetch("http://localhost:3001/resumen-asesores");

        if (!response.ok) {
          throw new Error("Error al obtener el resumen de asesores");
        }

        const data = await response.json();
        setAsesores(data);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResumen();
  }, []);

  // Renderización condicional
  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Resumen de Asesores
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Nombre
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Meta Clientes
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Progreso Meta (%)
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Total Clientes
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Activos
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                En Proceso
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Inactivos
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Cerrados
              </th>
            </tr>
          </thead>
          <tbody>
            {asesores.map((asesor, index) => (
              <tr
                key={asesor.nombre}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.nombre}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.max_clientes}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.progreso_meta}%
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.total_clientes}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.estados.Activo || 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.estados["En proceso de contacto"] || 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.estados.Inactivo || 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {asesor.estados.Cerrado || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
