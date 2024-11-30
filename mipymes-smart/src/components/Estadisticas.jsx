import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

// Registra los componentes de Chart.js necesarios
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement
);

function Estadisticas() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [asesoresEstadisticas, setAsesoresEstadisticas] = useState(null);
  const [registroClientesEstadisticas, setRegistroClientesEstadisticas] =
    useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch("http://localhost:3001/estadisticas");
        const data = await response.json();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    const fetchAsesoresEstadisticas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/estadisticas/asesores"
        );
        const data = await response.json();
        setAsesoresEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener estadísticas por asesores:", error);
      }
    };

    const fetchRegistroClientesEstadisticas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/estadisticas/registroClientes"
        );
        const data = await response.json();
        setRegistroClientesEstadisticas(data);
      } catch (error) {
        console.error(
          "Error al obtener estadísticas de registro de clientes:",
          error
        );
      }
    };

    fetchEstadisticas();
    fetchAsesoresEstadisticas();
    fetchRegistroClientesEstadisticas();
  }, []);

  if (!estadisticas || !asesoresEstadisticas || !registroClientesEstadisticas) {
    return <p>Cargando estadísticas...</p>;
  }

  // Datos para el gráfico de barras (clientes por estado)
  const clientesPorEstadoData = {
    labels: estadisticas.clientesPorEstado.map((estado) => estado._id),
    datasets: [
      {
        label: "Clientes por Estado",
        data: estadisticas.clientesPorEstado.map((estado) => estado.count),
        backgroundColor: "#424874",
        borderColor: "#424874",
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de torta (servicios requeridos)
  const serviciosRequeridosData = {
    labels: estadisticas.serviciosRequeridos.map((servicio) => servicio._id),
    datasets: [
      {
        label: "Servicios Requeridos",
        data: estadisticas.serviciosRequeridos.map(
          (servicio) => servicio.count
        ),
        backgroundColor: [
          "#424874",
          "#DCD6F7",
          "#A6B1E1",
          "#CACFD6",
          "#D6E5E3",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Datos para el gráfico de barras (clientes por rubro)
  const clientesPorRubroData = {
    labels: estadisticas.clientesPorRubro.map((rubro) => rubro._id),
    datasets: [
      {
        label: "Clientes por Rubro",
        data: estadisticas.clientesPorRubro.map((rubro) => rubro.count),
        backgroundColor: "#A6B1E1",
        borderColor: "#A6B1E1",
        borderWidth: 1,
      },
    ],
  };

  const clientesPorAsesorData = {
    labels: asesoresEstadisticas.estadisticasPorAsesor.map(
      (asesor) => asesor._id
    ),
    datasets: [
      {
        label: "Clientes por Asesor",
        data: asesoresEstadisticas.estadisticasPorAsesor.map(
          (asesor) => asesor.count
        ),
        backgroundColor: "#424874",
        borderColor: "#424874",
        borderWidth: 1,
      },
    ],
  };

  const clientesRegistradosData = {
    labels: registroClientesEstadisticas.registroClientes.map(
      (periodo) => periodo._id
    ),
    datasets: [
      {
        label: "Clientes Registrados",
        data: registroClientesEstadisticas.registroClientes.map(
          (registro) => registro.count
        ),
        backgroundColor: "#A6B1E1",
        borderColor: "#A6B1E1",
        borderWidth: 1,
      },
    ],
  };

  const handleDescargarReporte = async () => {
    try {
      // Usamos fetch para obtener el archivo PDF como blob (binario)
      const response = await fetch(
        "http://localhost:3001/estadisticas/reporte",
        {
          method: "GET", // Método GET para solicitar el reporte
        }
      );

      // Verificamos si la respuesta es exitosa (status 200)
      if (
        response.ok &&
        response.headers.get("Content-Type") === "application/pdf"
      ) {
        // Convertir la respuesta en un blob (binario)
        const blob = await response.blob();

        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace para descargar el archivo PDF
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reporte.pdf"); // Nombre del archivo descargado

        // Simular un clic en el enlace para descargar el archivo
        document.body.appendChild(link);
        link.click();

        // Limpiar el enlace después de la descarga
        document.body.removeChild(link);

        // Liberar el objeto URL creado
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Error al obtener el reporte:", response.status);
        const text = await response.text();
        console.error("Mensaje del servidor:", text);
      }
    } catch (error) {
      console.error("Error al descargar el reporte:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>
      <button
        onClick={handleDescargarReporte}
        className="bg-gray-300 mt-3 border border-gray-300 hover:bg-gray-400 text-sm rounded p-1.5 px-4 mb-5"
      >
        Descargar Reporte
      </button>

      {/* Total de Clientes */}
      <p className="text-lg">
        Total de Clientes:{" "}
        {estadisticas.clientesPorEstado.reduce(
          (acc, estado) => acc + estado.count,
          0
        )}
      </p>

      {/* Gráfico de Clientes por Estado */}
      <h3 className="font-semibold text-lg mt-4">Clientes por Estado</h3>
      <div className="mb-8" style={{ width: "600px", height: "250px" }}>
        <Bar data={clientesPorEstadoData} />
      </div>

      {/* Gráfico de Clientes por Rubro */}
      <h3 className="font-semibold text-lg mt-4">Clientes por Rubro</h3>
      <div className="mb-8" style={{ width: "600px", height: "250px" }}>
        <Bar data={clientesPorRubroData} />
      </div>

      {/* Gráfico de Servicios Requeridos */}
      <h3 className="font-semibold text-lg mt-4">Servicios Requeridos</h3>
      <div className="mb-8" style={{ width: "600px", height: "400px" }}>
        <Pie data={serviciosRequeridosData} />
      </div>

      {/* Gráfico de Clientes por Asesor */}
      <h3 className="font-semibold text-lg mt-4">Clientes por Asesor</h3>
      <div className="mb-8 " style={{ width: "600px", height: "250px" }}>
        <Bar data={clientesPorAsesorData} />
      </div>

      {/* Gráfico de Clientes Registrados */}
      <h3 className="font-semibold text-lg mt-4">
        Clientes Registrados en los Últimos 30, 60 y 90 Días
      </h3>
      <div className="mb-8" style={{ width: "600px", height: "250px" }}>
        <Bar data={clientesRegistradosData} />
      </div>

      {/* Promedio de Clientes por Asesor */}
      <h3 className="font-semibold text-lg mt-4">
        Promedio de Clientes por Asesor
      </h3>
      <p>{estadisticas.promedioClientesPorAsesor.toFixed(2)}</p>
    </div>
  );
}

export default Estadisticas;
