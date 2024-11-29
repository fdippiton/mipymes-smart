import React, { useState, useEffect } from "react";

function ListarAsesores() {
  const [dataAsesores, setDataAsesores] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
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
        setDataAsesores(data); // Almacenar la información del perfil en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-md font-normal mb-3">Asesores disponibles</h2>

      <div className="space-y-4">
        {dataAsesores.map((asesor) => (
          <div
            onClick={() => handleRowClick(asesor._id)}
            key={asesor._id}
            className={`border p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${
              expandedRow === asesor._id ? "bg-gray-50" : ""
            }`}
          >
            <h5 className="text-lg font-semibold text-gray-800">
              {asesor.nombre}
            </h5>
            <h6 className="text-sm text-gray-600">
              Email: {asesor.contacto.email}
            </h6>
            <h6 className="text-sm text-gray-600">
              Teléfono: {asesor.contacto.telefono}
            </h6>
            <h6 className="text-sm text-gray-600">
              Especialidades:{" "}
              {Array.isArray(asesor.especialidades)
                ? asesor.especialidades.map((especialidad, index) => (
                    <span
                      key={index}
                      className="my-1 inline-block  text-xs font-medium mr-2 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded"
                    >
                      {especialidad}
                    </span>
                  ))
                : typeof asesor.especialidades === "string"
                ? asesor.especialidades
                    .trim()
                    .split(",")
                    .map((especialidad, index) => (
                      <span
                        key={index}
                        className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                      >
                        {especialidad}
                      </span>
                    ))
                : "No especificadas"}
            </h6>
            {expandedRow === asesor._id && (
              <div className="mt-4 space-y-2">
                <div className="bg-gray-100 p-2 rounded">
                  <span className="font-semibold text-gray-700 text-sm">
                    Disponibilidad clientes:
                  </span>{" "}
                  <h2 className="text-sm">{asesor.max_clientes} clientes</h2>
                </div>

                <div className="bg-gray-100 p-2 rounded">
                  <span className="font-semibold text-gray-700 text-sm">
                    Clientes asignados:
                  </span>
                  <ul className="list-disc pl-5">
                    {[
                      ...new Set(
                        asesor.clientes_asignados.map(
                          (cliente) => cliente.nombre
                        )
                      ),
                    ].map((nombre, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ListarAsesores;
