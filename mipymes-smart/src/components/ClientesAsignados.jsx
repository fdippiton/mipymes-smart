import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import { MdExpandMore } from "react-icons/md";

function ClientesAsignados() {
  const [dataClientes, setDataClientes] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRowAsesoria, setExpandedRowAsesoria] = useState(null);
  const [expandedRowDocAsesoria, setExpandedDocRowAsesoria] = useState(null);
  const [expandedRowDocAsesoriaUpdate, setExpandedDocRowAsesoriaUpdate] =
    useState(null);
  const [expandedRowNewAsesoria, setExpandedRowNewAsesoria] = useState(null);
  const [asesorId, setAsesorId] = useState(null);
  const [asesorias, setAsesorias] = useState([]);
  const [docAsesorias, setDocAsesorias] = useState({});
  const [loading, setLoading] = useState(true); // Estado de carga
  const [reload, setReload] = useState(false);
  const [hideForm, sethideForm] = useState(false);
  const [currentDocAsesoria, setcurrentDocAsesoria] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado seleccionado

  const [id, setId] = useState(false);
  const [cliente_id, setCliente_id] = useState("");
  const [asesoria_id, setAsesoria_id] = useState("");
  const [asesor_id, setAsesor_id] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [duracion_sesion, setDuracion_sesion] = useState("");
  const [tema_principal, setTema_principal] = useState("");
  const [documentos_compartidos, setDocumentos_compartidos] = useState("");
  const [temas_tratados, setTemas_tratados] = useState("");
  const [objetivos_acordados, setObjetivos_acordados] = useState("");
  const [talleres_recomendados, setTalleres_recomendados] = useState("");
  const [observaciones_adicionales, setObservaciones_adicionales] =
    useState("");
  const [estado, setEstado] = useState("");
  const [foto, setFoto] = useState(null);

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

    const response = await fetch("http://localhost:3001/registrarDocAsesoria", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      const newDoc = await response.json(); // Obtén el nuevo documento devuelto por el servidor
      alert("Asesoría creada exitosamente.");

      // Actualiza el estado con el nuevo documento
      setDocAsesorias((prevDocs) => [...prevDocs, newDoc]);
      setReload((prev) => !prev); // Cambia el estado para forzar la recarga
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
      className="max-w-4xl  p-6 bg-white shadow-lg rounded-lg space-y-6"
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

      {/* Estado */}
      <div className="flex flex-col">
        <label
          htmlFor="estado"
          className="font-medium text-sm"
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
        >
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          value={(formData.estado = "Pendiente")}
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
    </form>
  );

  const eliminarDoc = async (docAsesoriaId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/eliminarDocAsesoria/${docAsesoriaId}`,
        {
          method: "DELETE",
          credentials: "include", // Incluir cookies en la solicitud
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Error del servidor:", error);
      } else {
        console.log("Documento eliminado exitosamente");
        setDocAsesorias((prevDocs) =>
          prevDocs.filter((doc) => doc._id !== docAsesoriaId)
        );
      }
    } catch (error) {
      console.error("Error al eliminar el documento de la asesoría:", error);
    }
  };

  const mostrarDetallesAsesoria = (asesoriaId) => {
    // Alternar expansión: si el ID ya está seleccionado, se cierra, sino se abre
    setExpandedDocRowAsesoria((prevState) =>
      prevState === asesoriaId ? null : asesoriaId
    );
    // Asegurarse de que el formulario de actualización esté oculto al ver los detalles
    setExpandedDocRowAsesoriaUpdate(null);
    sethideForm(false);
  };

  // Manejar la actualización de la asesoría
  const handleSubmitUpdate = async (e, asesoriaIdDoc) => {
    e.preventDefault();

    const dataDoc = {
      asesoria_id,
      cliente_id,
      asesor_id,
      fecha,
      hora,
      duracion_sesion,
      tema_principal,
      documentos_compartidos,
      temas_tratados,
      objetivos_acordados,
      talleres_recomendados,
      observaciones_adicionales,
      estado,
    };

    if (!asesoriaIdDoc) {
      return res.status(400).json({ error: "ID no proporcionado" });
    }

    console.log("dataDoc", dataDoc);

    try {
      const response = await fetch(
        `http://localhost:3001/docAsesoriasUpdate/${asesoriaIdDoc}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataDoc),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedDoc = await response.json();

      // Mostrar notificación al usuario
      alert("Asesoría actualizada exitosamente");

      // Actualizar el estado local con el documento actualizado
      setDocAsesorias((prevDocs) =>
        prevDocs.map((doc) => (doc._id === updatedDoc._id ? updatedDoc : doc))
      );

      // Resetear el formulario y cerrar
      resetForm();
      sethideForm(true);

      // Expandir la fila actualizada
      setExpandedDocRowAsesoria(asesoriaIdDoc);
      setExpandedDocRowAsesoriaUpdate(null);
    } catch (error) {
      console.error("Error updating document:", error);
      alert(
        "Hubo un error al actualizar la asesoría. Por favor, intenta nuevamente."
      );
    }
  };

  // Función para manejar el clic en el ícono de edición
  const mostrarUpdateForm = (asesoriaId) => {
    // Mostrar el formulario de actualización solo si el formulario no está oculto
    if (expandedRowDocAsesoriaUpdate === asesoriaId) {
      setExpandedDocRowAsesoriaUpdate(null); // Si ya está expandido, cerrar el formulario
    } else {
      setExpandedDocRowAsesoriaUpdate(asesoriaId); // Abrir formulario de actualización
    }
    sethideForm(false); // Asegurarse de que el formulario no esté oculto cuando se edita
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await Cookies.get("token");
      const decoded = jwtDecode(token);
      setAsesorId(decoded.id); // Guardar el ID del asesor en el estado

      try {
        const response = await fetch(
          "http://localhost:3001/getAllAsesorClientes",
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
          "http://localhost:3001/getAllAsesorias",
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
          "http://localhost:3001/getAllDocAsesorias",
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
      } finally {
        setLoading(false); // Desactivar el estado de carga
      }
    };
    fetchData();
  }, [reload, hideForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  useEffect(() => {
    if (currentDocAsesoria) {
      setId(currentDocAsesoria._id);
      setAsesoria_id(currentDocAsesoria.asesoria_id);
      setCliente_id(currentDocAsesoria.cliente_id);
      setHora(currentDocAsesoria.hora);
      setDuracion_sesion(currentDocAsesoria.duracion_sesion);
      setFecha(formatFecha(currentDocAsesoria.fecha));
      setAsesor_id(currentDocAsesoria.asesor_id);
      setTema_principal(currentDocAsesoria.tema_principal);
      setDocumentos_compartidos(currentDocAsesoria.documentos_compartidos);
      setTemas_tratados(currentDocAsesoria.temas_tratados);
      setObjetivos_acordados(currentDocAsesoria.objetivos_acordados);
      setTalleres_recomendados(currentDocAsesoria.talleres_recomendados);
      setObservaciones_adicionales(
        currentDocAsesoria.observaciones_adicionales
      );
      setFoto(currentDocAsesoria.foto);
      setEstado(currentDocAsesoria.estado);
    }
  }, [currentDocAsesoria]);

  const renderDocUpdate = (docAsesoria) => {
    console.log("docAsesoria", currentDocAsesoria);
    return (
      <form
        onSubmit={(e) => handleSubmitUpdate(e, id)}
        className="max-w-2xl mx-auto space-y-4 p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          Actualizar documentación Asesoría
        </h2>

        <div className="space-y-2">
          <label
            htmlFor="asesoria_id"
            x
            className="block text-sm font-medium"
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          >
            Asesoría
          </label>
          <input
            type="text"
            id="asesoria_id"
            name="asesoria_id"
            value={asesoria_id}
            onChange={(ev) => setAsesor_id(ev.target.value)}
            className="w-full p-2 border rounded-md"
            disabled
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="cliente_id"
            className="block text-sm font-medium"
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          >
            Cliente
          </label>
          <input
            type="text"
            id="cliente_id"
            name="cliente_id"
            value={cliente_id}
            onChange={(ev) => setCliente_id(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
            disabled
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="asesor_id"
            className="block text-sm font-medium"
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          >
            Asesor
          </label>
          <input
            type="text"
            id="asesor_id"
            name="asesor_id"
            value={asesor_id}
            onChange={(ev) => setAsesor_id(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
            disabled
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fecha" className="block text-sm font-medium">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={fecha} // Aseguramos el formato YYYY-MM-DD
            onChange={(ev) => setFecha(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="hora" className="block text-sm font-medium">
            Hora
          </label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={hora}
            onChange={(ev) => setHora(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="duracion_sesion"
            className="block text-sm font-medium"
          >
            Duración de la sesión
          </label>
          <input
            type="text"
            id="duracion_sesion"
            name="duracion_sesion"
            value={duracion_sesion}
            onChange={(ev) => setDuracion_sesion(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tema_principal" className="block text-sm font-medium">
            Tema principal
          </label>
          <input
            type="text"
            id="tema_principal"
            name="tema_principal"
            value={tema_principal}
            onChange={(ev) => setTema_principal(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="documentos_compartidos"
            className="block text-sm font-medium"
          >
            Documentos Compartidos
          </label>
          <textarea
            id="documentos_compartidos"
            name="documentos_compartidos"
            value={documentos_compartidos}
            onChange={(ev) => setDocumentos_compartidos(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="temas_tratados" className="block text-sm font-medium">
            Temas tratados
          </label>
          <textarea
            id="temas_tratados"
            name="temas_tratados"
            value={temas_tratados}
            onChange={(ev) => setTemas_tratados(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="objetivos_acordados"
            className="block text-sm font-medium"
          >
            Objetivos Acordados
          </label>
          <textarea
            id="objetivos_acordados"
            name="objetivos_acordados"
            value={objetivos_acordados}
            onChange={(ev) => setObjetivos_acordados(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="talleres_recomendados"
            className="block text-sm font-medium"
          >
            Talleres recomendados
          </label>
          <textarea
            id="talleres_recomendados"
            name="talleres_recomendados"
            value={talleres_recomendados}
            onChange={(ev) => setTalleres_recomendados(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="observaciones_adicionales"
            className="block text-sm font-medium"
          >
            Observaciones Adicionales
          </label>
          <textarea
            id="observaciones_adicionales"
            name="observaciones_adicionales"
            value={observaciones_adicionales}
            onChange={(ev) => setObservaciones_adicionales(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="estado" className="block text-sm font-medium">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={estado}
            onChange={(ev) => setEstado(ev.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="foto"
            className="block text-sm font-medium"
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          >
            Foto
          </label>
          <input
            type="text"
            id="foto"
            name="foto"
            value={foto}
            onChange={(ev) => setFoto(ev.target.value)}
            className="w-full p-2 border rounded-md"
            style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
          />
        </div>

        <button
          type="submit"
          className="w-full border bg-emerald-400 text-white  hover:text-black hover:bg-emerald-100 text-sm border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-emerald-300"
        >
          Actualizar Asesoría
        </button>
      </form>
    );
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value); // Actualiza el estado del filtro
  };

  return (
    <div>
      {" "}
      {/* Clients List */}
      <div className="bg-white p-5 rounded-lg shadow mt-1">
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
                  <div className="flex border w-52 px-10 py-3 items-center rounded-sm hover:bg-gray-200">
                    <MdExpandMore className="mr-2" />
                    {cliente.cliente_id.nombre}
                  </div>
                </td>
                <td>
                  <div
                    className="flex border w-52 px-10 py-3 items-center rounded-sm hover:bg-gray-200"
                    onClick={() => handleAsesoriaClick(index)}
                  >
                    <MdExpandMore className="mr-2" />
                    Ver asesorias
                  </div>
                  {/* <Link
                    className="border  hover:bg-gray-200 w-52 px-10 py-3 rounded-sm"
                    onClick={() => handleAsesoriaClick(index)}
                  >
                    <MdExpandMore className="mr-2" />
                    Ver asesorias
                  </Link> */}
                </td>
              </tr>
              {/* Informacion del cliente */}
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
              {/* Asesorias del cliente */}
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
                                {/* Asesoria empresarial */}
                                {asesoria.asesor_empresarial_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      {/* Menú desplegable para filtrar por estado */}
                                      <div className="mb-4">
                                        <label
                                          htmlFor="estado"
                                          className="mr-2"
                                        >
                                          Filtrar por estado:
                                        </label>
                                        <select
                                          id="estado"
                                          value={selectedEstado}
                                          onChange={handleEstadoChange}
                                          className="border border-slate-300 rounded px-6 mt-3 pr-10 text-sm bg-gray-100 cursor-pointer"
                                        >
                                          <option value="">Todos</option>
                                          <option value="Pendiente">
                                            Pendiente
                                          </option>
                                          <option value="Completada">
                                            Completada
                                          </option>
                                          <option value="Cancelada">
                                            Cancelada
                                          </option>
                                          {/* Agrega más opciones según sea necesario */}
                                        </select>
                                      </div>
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
                                        Documentar nueva sesión de asesoría
                                      </button>

                                      {/* Formulario nueva doc asesoria */}
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

                                      {/* Listar asesorias */}
                                      <div className="flex flex-wrap m-3">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ===
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ===
                                                "Asesoria Empresarial" &&
                                              (selectedEstado === "" ||
                                                docAsesoria.estado ===
                                                  selectedEstado) // Aplica el filtro por estado
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className={`m-3 cursor-pointer mt-3 max-w-md rounded-lg shadow-lg p-6 mb-6 ${
                                                expandedRowDocAsesoria ===
                                                doc._id
                                                  ? "bg-white w-full max-w-screen-xl"
                                                  : ""
                                              }`}
                                              onClick={() => {
                                                mostrarDetallesAsesoria(
                                                  doc._id
                                                );
                                                setcurrentDocAsesoria(doc);
                                              }}
                                            >
                                              {/* Mostrar detalles y el icono de edición solo si la tarjeta está expandida */}
                                              {expandedRowDocAsesoria ===
                                                doc._id && (
                                                <div className="flex justify-between ">
                                                  <h1
                                                    className="mr-2"
                                                    style={{
                                                      backgroundColor:
                                                        doc.estado ===
                                                        "Pendiente"
                                                          ? "red"
                                                          : doc.estado ===
                                                            "Completada"
                                                          ? "green"
                                                          : "black", // Negro por defecto para otros estados
                                                      width: "15px",
                                                      height: "15px",
                                                      borderRadius: "50%",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                    }}
                                                  ></h1>
                                                  <FaRegEdit
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation(); // Prevenir el clic en la tarjeta
                                                      mostrarUpdateForm(
                                                        doc._id
                                                      ); // Mostrar el formulario de actualización
                                                    }}
                                                  />
                                                </div>
                                              )}

                                              {/* Mostrar detalles o formulario de actualización */}
                                              {expandedRowDocAsesoria ===
                                              doc._id ? (
                                                <div className="space-y-4 py-3">
                                                  {expandedRowDocAsesoriaUpdate ===
                                                    doc._id && !hideForm ? (
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el evento haga bubbling
                                                        // Actualiza el estado con el documento actual
                                                      }}
                                                    >
                                                      {renderDocUpdate(doc)}{" "}
                                                      {/* Formulario de actualización */}
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <h3 className="text-xl font-semibold">
                                                        Detalles de la Asesoría
                                                      </h3>
                                                      <p>
                                                        <strong>Fecha:</strong>{" "}
                                                        {formatFecha(doc.fecha)}
                                                      </p>
                                                      <p>
                                                        <strong>Hora:</strong>{" "}
                                                        {doc.hora}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Duración:
                                                        </strong>{" "}
                                                        {doc.duracion_sesion ||
                                                          "No especificada"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Tema principal:
                                                        </strong>{" "}
                                                        {doc.tema_principal ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Temas tratados:
                                                        </strong>{" "}
                                                        {doc.temas_tratados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Objetivos acordados:
                                                        </strong>{" "}
                                                        {doc.objetivos_acordados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Documentos
                                                          Compartidos:
                                                        </strong>{" "}
                                                        {doc.documentos_compartidos ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Observaciones
                                                          adicionales:
                                                        </strong>{" "}
                                                        {doc.observaciones_adicionales ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>Estado:</strong>{" "}
                                                        {doc.estado ||
                                                          "No especificado"}
                                                      </p>
                                                    </>
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="flex flex-row justify-between items-start">
                                                  <div className="mt-3">
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                      {doc.asesoria_id
                                                        ?.nombre_asesoria ||
                                                        "N/A"}
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
                                                      {doc.fecha
                                                        ? formatFecha(doc.fecha)
                                                        : "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mb-1">
                                                      <span className="font-medium text-gray-600">
                                                        Hora:
                                                      </span>{" "}
                                                      {doc.hora ||
                                                        "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                      <span className="font-medium text-gray-600">
                                                        Estado:
                                                      </span>{" "}
                                                      {doc.estado ||
                                                        "No especificado"}
                                                    </p>
                                                  </div>
                                                  <div className="flex justify-end items-center">
                                                    <h1
                                                      className="mr-2"
                                                      style={{
                                                        backgroundColor:
                                                          doc.estado ===
                                                          "Pendiente"
                                                            ? "red"
                                                            : doc.estado ===
                                                              "Completada"
                                                            ? "green"
                                                            : "black", // Negro por defecto para otros estados
                                                        width: "15px",
                                                        height: "15px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                      }}
                                                    ></h1>
                                                    {/* <MdOutlineCancelPresentation
                                                      className="h-5 w-5 cursor-pointer"
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Prevenir el clic en la tarjeta
                                                        doc.estado ===
                                                        "Completada"
                                                          ? alert(
                                                              "No se puede eliminar una asesoria completada"
                                                            )
                                                          : eliminarDoc(
                                                              doc?._id
                                                            );
                                                      }}
                                                    /> */}
                                                    <MdOutlineCancelPresentation
                                                      className="h-5 w-5 cursor-pointer"
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Prevenir el clic en la tarjeta

                                                        if (
                                                          doc.estado ===
                                                          "Completada"
                                                        ) {
                                                          // Mostrar alerta si la asesoría está completada
                                                          alert(
                                                            "No se puede eliminar una asesoría completada"
                                                          );
                                                        } else {
                                                          // Confirmar si se desea eliminar
                                                          const confirmacion =
                                                            window.confirm(
                                                              "¿Estás seguro de que deseas eliminar esta asesoría?"
                                                            );
                                                          if (confirmacion) {
                                                            eliminarDoc(
                                                              doc?._id
                                                            );
                                                          }
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                {/* Asesoria financiera */}
                                {asesoria.asesor_financiero_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
                                      <strong className="text-sm   rounded-md mb-0.5 block">
                                        Financiero
                                      </strong>
                                      <button
                                        onClick={() =>
                                          handleNewAsesoriaClick(
                                            index,
                                            "financiero"
                                          )
                                        }
                                        className="mt-2 flex items-center gap-1 p-1.5 border border-gray-300 rounded-md hover:bg-emerald-100"
                                      >
                                        <IoIosAddCircle className="text-xl" />
                                        Documentar nueva sesión de asesoría
                                      </button>
                                      {/* Formulario nueva doc asesoria */}
                                      {expandedRowNewAsesoria ===
                                        `${index}-financiero` && (
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
                                              )[0], // Selecciona el primer _id de la asesoría que cumpla la condición
                                            cliente.cliente_id._id,
                                            asesorId
                                          )}
                                        </div>
                                      )}

                                      {/* Listar asesorias */}
                                      <div className="flex flex-wrap m-3">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ===
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ===
                                                "Asesoría Financiera" &&
                                              (selectedEstado === "" ||
                                                docAsesoria.estado ===
                                                  selectedEstado)
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className={`m-3 cursor-pointer mt-3 max-w-md rounded-lg shadow-lg p-6 mb-6 ${
                                                expandedRowDocAsesoria ===
                                                doc._id
                                                  ? "bg-white w-full max-w-screen-xl"
                                                  : ""
                                              }`}
                                              onClick={() => {
                                                mostrarDetallesAsesoria(
                                                  doc._id
                                                );
                                                setcurrentDocAsesoria(doc);
                                              }}
                                            >
                                              {/* Mostrar detalles y el icono de edición solo si la tarjeta está expandida */}
                                              {expandedRowDocAsesoria ===
                                                doc._id && (
                                                <div className="flex justify-between">
                                                  <h1
                                                    className="mr-2"
                                                    style={{
                                                      backgroundColor:
                                                        doc.estado ===
                                                        "Pendiente"
                                                          ? "red"
                                                          : doc.estado ===
                                                            "Completada"
                                                          ? "green"
                                                          : "black", // Negro por defecto para otros estados
                                                      width: "15px",
                                                      height: "15px",
                                                      borderRadius: "50%",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                    }}
                                                  ></h1>
                                                  <FaRegEdit
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation(); // Prevenir el clic en la tarjeta
                                                      mostrarUpdateForm(
                                                        doc._id
                                                      ); // Mostrar el formulario de actualización
                                                    }}
                                                  />
                                                </div>
                                              )}

                                              {/* Mostrar detalles o formulario de actualización */}
                                              {expandedRowDocAsesoria ===
                                              doc._id ? (
                                                <div className="space-y-4">
                                                  {expandedRowDocAsesoriaUpdate ===
                                                    doc._id && !hideForm ? (
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el evento haga bubbling
                                                        // Actualiza el estado con el documento actual
                                                      }}
                                                    >
                                                      {renderDocUpdate(doc)}{" "}
                                                      {/* Formulario de actualización */}
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <h3 className="text-md font-semibold">
                                                        Detalles de la Asesoría
                                                      </h3>
                                                      <p>
                                                        <strong>Fecha:</strong>{" "}
                                                        {formatFecha(doc.fecha)}
                                                      </p>
                                                      <p>
                                                        <strong>Hora:</strong>{" "}
                                                        {doc.hora}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Duración:
                                                        </strong>{" "}
                                                        {doc.duracion_sesion ||
                                                          "No especificada"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Tema principal:
                                                        </strong>{" "}
                                                        {doc.tema_principal ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Temas tratados:
                                                        </strong>{" "}
                                                        {doc.temas_tratados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Objetivos acordados:
                                                        </strong>{" "}
                                                        {doc.objetivos_acordados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Documentos
                                                          Compartidos:
                                                        </strong>{" "}
                                                        {doc.documentos_compartidos ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Observaciones
                                                          adicionales:
                                                        </strong>{" "}
                                                        {doc.observaciones_adicionales ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>Estado:</strong>{" "}
                                                        {doc.estado ||
                                                          "No especificado"}
                                                      </p>
                                                    </>
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="flex flex-row justify-between items-start">
                                                  <div className="mt-3">
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                      {doc.asesoria_id
                                                        ?.nombre_asesoria ||
                                                        "N/A"}
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
                                                      {doc.fecha
                                                        ? formatFecha(doc.fecha)
                                                        : "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mb-1">
                                                      <span className="font-medium text-gray-600">
                                                        Hora:
                                                      </span>{" "}
                                                      {doc.hora ||
                                                        "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                      <span className="font-medium text-gray-600">
                                                        Estado:
                                                      </span>{" "}
                                                      {doc.estado ||
                                                        "No especificado"}
                                                    </p>
                                                  </div>
                                                  <div className="flex justify-end items-center">
                                                    <h1
                                                      className="mr-2"
                                                      style={{
                                                        backgroundColor:
                                                          doc.estado ===
                                                          "Pendiente"
                                                            ? "red"
                                                            : doc.estado ===
                                                              "Completada"
                                                            ? "green"
                                                            : "black", // Negro por defecto para otros estados
                                                        width: "15px",
                                                        height: "15px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                      }}
                                                    ></h1>
                                                    <MdOutlineCancelPresentation
                                                      className="h-5 w-5 cursor-pointer"
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Prevenir el clic en la tarjeta

                                                        if (
                                                          doc.estado ===
                                                          "Completada"
                                                        ) {
                                                          // Mostrar alerta si la asesoría está completada
                                                          alert(
                                                            "No se puede eliminar una asesoría completada"
                                                          );
                                                        } else {
                                                          // Confirmar si se desea eliminar
                                                          const confirmacion =
                                                            window.confirm(
                                                              "¿Estás seguro de que deseas eliminar esta asesoría?"
                                                            );
                                                          if (confirmacion) {
                                                            eliminarDoc(
                                                              doc?._id
                                                            );
                                                          }
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Asesoria tecnologicas */}
                                {asesoria.asesor_tecnologico_id === asesorId &&
                                  asesoria.cliente_id ===
                                    cliente.cliente_id && (
                                    <div className="mb-6">
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
                                        Documentar nueva sesión de asesoría
                                      </button>
                                      {/* Formulario nueva doc asesoria */}
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
                                            cliente.cliente_id._id,
                                            asesorId
                                          )}
                                        </div>
                                      )}

                                      {/* Listar asesorias */}
                                      <div className="flex flex-wrap m-3">
                                        {docAsesorias
                                          .filter((docAsesoria) => {
                                            return (
                                              docAsesoria &&
                                              docAsesoria.cliente_id._id ===
                                                cliente.cliente_id._id &&
                                              docAsesoria.asesor_id ===
                                                asesorId &&
                                              docAsesoria.asesoria_id
                                                ?.nombre_asesoria ===
                                                "Asesoria Tecnológica" &&
                                              (selectedEstado === "" ||
                                                docAsesoria.estado ===
                                                  selectedEstado)
                                            );
                                          })
                                          .map((doc, index) => (
                                            <div
                                              key={index}
                                              className={`m-3 cursor-pointer mt-3 max-w-md rounded-lg shadow-lg p-6 mb-6 ${
                                                expandedRowDocAsesoria ===
                                                doc._id
                                                  ? "bg-white w-full max-w-screen-xl"
                                                  : ""
                                              }`}
                                              onClick={() => {
                                                mostrarDetallesAsesoria(
                                                  doc._id
                                                );
                                                setcurrentDocAsesoria(doc);
                                              }}
                                            >
                                              {/* Mostrar detalles y el icono de edición solo si la tarjeta está expandida */}
                                              {expandedRowDocAsesoria ===
                                                doc._id && (
                                                <div className="flex justify-between">
                                                  <h1
                                                    className="mr-2"
                                                    style={{
                                                      backgroundColor:
                                                        doc.estado ===
                                                        "Pendiente"
                                                          ? "red"
                                                          : doc.estado ===
                                                            "Completada"
                                                          ? "green"
                                                          : "black", // Negro por defecto para otros estados
                                                      width: "15px",
                                                      height: "15px",
                                                      borderRadius: "50%",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                    }}
                                                  ></h1>
                                                  <FaRegEdit
                                                    className="h-5 w-5"
                                                    onClick={(e) => {
                                                      e.stopPropagation(); // Prevenir el clic en la tarjeta
                                                      mostrarUpdateForm(
                                                        doc._id
                                                      ); // Mostrar el formulario de actualización
                                                    }}
                                                  />
                                                </div>
                                              )}

                                              {/* Mostrar detalles o formulario de actualización */}
                                              {expandedRowDocAsesoria ===
                                              doc._id ? (
                                                <div className="space-y-4">
                                                  {expandedRowDocAsesoriaUpdate ===
                                                    doc._id && !hideForm ? (
                                                    <div
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Evita que el evento haga bubbling
                                                        // Actualiza el estado con el documento actual
                                                      }}
                                                    >
                                                      {renderDocUpdate(doc)}{" "}
                                                      {/* Formulario de actualización */}
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <h3 className="text-md font-semibold">
                                                        Detalles de la Asesoría
                                                      </h3>
                                                      <p>
                                                        <strong>Fecha:</strong>{" "}
                                                        {formatFecha(doc.fecha)}
                                                      </p>
                                                      <p>
                                                        <strong>Hora:</strong>{" "}
                                                        {doc.hora}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Duración:
                                                        </strong>{" "}
                                                        {doc.duracion_sesion ||
                                                          "No especificada"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Tema principal:
                                                        </strong>{" "}
                                                        {doc.tema_principal ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Temas tratados:
                                                        </strong>{" "}
                                                        {doc.temas_tratados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Objetivos acordados:
                                                        </strong>{" "}
                                                        {doc.objetivos_acordados ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Documentos
                                                          Compartidos:
                                                        </strong>{" "}
                                                        {doc.documentos_compartidos ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>
                                                          Observaciones
                                                          adicionales:
                                                        </strong>{" "}
                                                        {doc.observaciones_adicionales ||
                                                          "No especificado"}
                                                      </p>
                                                      <p>
                                                        <strong>Estado:</strong>{" "}
                                                        {doc.estado ||
                                                          "No especificado"}
                                                      </p>
                                                    </>
                                                  )}
                                                </div>
                                              ) : (
                                                <div className="flex flex-row justify-between items-start">
                                                  <div className="mt-3">
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                      {doc.asesoria_id
                                                        ?.nombre_asesoria ||
                                                        "N/A"}
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
                                                      {doc.fecha
                                                        ? formatFecha(doc.fecha)
                                                        : "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mb-1">
                                                      <span className="font-medium text-gray-600">
                                                        Hora:
                                                      </span>{" "}
                                                      {doc.hora ||
                                                        "No especificada"}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                      <span className="font-medium text-gray-600">
                                                        Estado:
                                                      </span>{" "}
                                                      {doc.estado ||
                                                        "No especificado"}
                                                    </p>
                                                  </div>
                                                  <div className="flex justify-end items-center">
                                                    <h1
                                                      className="mr-2"
                                                      style={{
                                                        backgroundColor:
                                                          doc.estado ===
                                                          "Pendiente"
                                                            ? "red"
                                                            : doc.estado ===
                                                              "Completada"
                                                            ? "green"
                                                            : "black", // Negro por defecto para otros estados
                                                        width: "15px",
                                                        height: "15px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                      }}
                                                    ></h1>
                                                    <MdOutlineCancelPresentation
                                                      className="h-5 w-5 cursor-pointer"
                                                      onClick={(e) => {
                                                        e.stopPropagation(); // Prevenir el clic en la tarjeta

                                                        if (
                                                          doc.estado ===
                                                          "Completada"
                                                        ) {
                                                          // Mostrar alerta si la asesoría está completada
                                                          alert(
                                                            "No se puede eliminar una asesoría completada"
                                                          );
                                                        } else {
                                                          // Confirmar si se desea eliminar
                                                          const confirmacion =
                                                            window.confirm(
                                                              "¿Estás seguro de que deseas eliminar esta asesoría?"
                                                            );
                                                          if (confirmacion) {
                                                            eliminarDoc(
                                                              doc?._id
                                                            );
                                                          }
                                                        }
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              )}
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
