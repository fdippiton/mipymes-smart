import React from "react";
import { useState, useEffect } from "react";

function Talleres() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [talleres, setTalleres] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const [newTaller, setNewTaller] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    instructor: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaller({ ...newTaller, [name]: value });
  };

  // Función para alternar la expansión de una tarjeta
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSubmitTaller = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", newTaller);

    const response = await fetch("http://localhost:3001/registrarTaller", {
      method: "POST",
      body: JSON.stringify(newTaller),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Incluir cookies en la solicitud
    });

    if (response.status === 200) {
      const taller = await response.json(); // Obtén el nuevo documento devuelto por el servidor
      alert("Taller creado exitosamente.");

      setNewTaller({
        titulo: "",
        descripcion: "",
        fecha: "",
        instructor: "",
      });
      setIsFormVisible(false);

      // Actualiza el estado con el nuevo documento
      setTalleres((prevDocs) => [...prevDocs, taller]);
      // setReload((prev) => !prev); // Cambia el estado para forzar la recarga
      // resetForm();
      // setExpandedRowNewAsesoria(null);
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("Error en el registro de taller. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/getTalleres`, {
          credentials: "include", // Incluir cookies en la solicitud
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTalleres(data); // Almacenar la información del perfil en el estado
        console.log(data); // Mostrar la información en la consola
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

  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Talleres</h1>
      </div>
      <div className="mt-5">
        <button
          className="text-sm border w-52 px-10 py-3 items-center rounded-md hover:bg-gray-300 bg-gray-200"
          onClick={() => setIsFormVisible(!isFormVisible)}
        >
          Nuevo taller
        </button>
      </div>

      {isFormVisible && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Agregar nuevo taller
          </h2>
          <form onSubmit={handleSubmitTaller} className="space-y-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={newTaller.titulo}
                onChange={handleInputChange}
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={newTaller.descripcion}
                onChange={handleInputChange}
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={newTaller.fecha}
                onChange={handleInputChange}
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructor
              </label>
              <input
                type="text"
                name="instructor"
                value={newTaller.instructor}
                onChange={handleInputChange}
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="text-sm border mr-3 w-32 px-6 py-3 items-center rounded-md text-white hover:bg-red-300 bg-red-500 hover:text-black"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="text-sm border w-42 px-6 py-2 items-center rounded-md hover:bg-gray-300 bg-gray-200"
              >
                Guardar Taller
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="">
        {talleres.map((taller) => (
          <div
            key={taller._id}
            className={`bg-white shadow-md rounded-lg transition-all duration-300 mt-5 ${
              expandedCard === taller._id
                ? "md:col-span-1 lg:col-span-1"
                : "transform hover:scale-105"
            }`}
          >
            {/* Tarjeta compacta: información básica */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleCard(taller._id)}
            >
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-gray-600">Titulo</span>{" "}
                {taller.titulo || "No especificado"}
              </p>

              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-600">Fecha:</span>{" "}
                {formatFecha(taller.fecha) || "No especificada"}
              </p>
            </div>

            {/* Detalles expandibles */}
            {expandedCard === taller._id && (
              <div className="bg-gray-50 border-t p-6 space-y-3 text-sm">
                <p>
                  <span className="font-medium">Titulo:</span>{" "}
                  {taller.titulo || "No especificada"}
                </p>
                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {formatFecha(taller.fecha) || "No especificada"}
                </p>
                <p>
                  <span className="font-medium">Descripcion:</span>{" "}
                  {taller.descripcion || "No especificada"}
                </p>
                <p>
                  <span className="font-medium">Instructor:</span>{" "}
                  {taller.instructor || "No especificado"}
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
  );
}

export default Talleres;
