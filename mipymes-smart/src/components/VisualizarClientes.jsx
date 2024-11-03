import React, { useState } from "react";
import { MdOutlineExpandMore } from "react-icons/md";

function VisualizarClientes() {
  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };
  return (
    <div>
      <div className=" grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Clientes Totales</h2>
          <p className="text-3xl font-bold text-blue-500">320</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Activos</h2>
          <p className="text-3xl font-bold text-blue-500">20</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Inactivos</h2>
          <p className="text-3xl font-bold text-blue-500">2</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">En proceso</h2>
          <p className="text-3xl font-bold text-blue-500">20</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Cerrados</h2>
          <p className="text-3xl font-bold text-blue-500">20</p>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-2xl font-semibold mb-4">Lista de Clientes</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left py-2">Nombre</th>
              <th className="text-left py-2">Asesor</th>
              <th className="text-left py-2">Asesorias completas</th>
              <th className="text-left py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cursor-pointer" onClick={() => handleRowClick(1)}>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisualizarClientes;
