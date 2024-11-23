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
        const response = await fetch("http://localhost:3000/estadisticas");
        const data = await response.json();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    const fetchAsesoresEstadisticas = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/estadisticas/asesores"
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
          "http://localhost:3000/estadisticas/registroClientes"
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
        backgroundColor: "#4caf50",
        borderColor: "#388e3c",
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
          "#ffb74d",
          "#f44336",
          "#03a9f4",
          "#e53935",
          "#8e24aa",
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
        backgroundColor: "#03a9f4",
        borderColor: "#0288d1",
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
        backgroundColor: "#03a9f4",
        borderColor: "#0288d1",
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
        backgroundColor: "#f44336",
        borderColor: "#d32f2f",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Estadísticas</h2>

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
