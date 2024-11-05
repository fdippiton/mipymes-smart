import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function Signup() {
  const [nombre, setNombre] = useState("");
  const [email_cliente, setEmail_cliente] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [email_empresa, setEmail_empresa] = useState("");
  const [nombre_empresa, setNombre_empresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rubro, setRubro] = useState("");
  const [descripcion_servicios, setDescripcion_servicios] = useState("");
  const [selectedOptionConocio_CMU, setSelectedOptionConocio_CMU] =
    useState("");
  const [selectedOptionIngresos, setSelectedOptionIngresos] = useState([]);
  const [
    selectedOptionsIServiciosNecesarios,
    setSelectedOptionsIServiciosNecesarios,
  ] = useState([]);

  const navigate = useNavigate();

  const [customMessage, setCustomMessage] = useState("");
  const [customMessageServicios, setCustomMessageServicios] = useState("");

  // Manejar el cambio de opción seleccionada
  const handleOptionChange = (e) => {
    setSelectedOptionConocio_CMU(e.target.value);
    if (e.target.value !== "Otro servicio") {
      setCustomMessage(""); // Reiniciar el mensaje personalizado si cambia la opción
    }
  };

  // Manejar el cambio de mensaje personalizado
  const handleCustomMessageChange = (e) => {
    setCustomMessage(e.target.value);
  };

  // Maneja el cambio de selección de cada checkbox
  const handleOptionChangeServicios = (e) => {
    const { value, checked } = e.target;

    // Si el checkbox está seleccionado, lo agregamos al array; si no, lo quitamos
    if (checked) {
      setSelectedOptionsIServiciosNecesarios([
        ...selectedOptionsIServiciosNecesarios,
        value,
      ]);
    } else {
      setSelectedOptionsIServiciosNecesarios(
        selectedOptionsIServiciosNecesarios.filter((option) => option !== value)
      );
    }
  };

  // async function register(ev) {
  //   ev.preventDefault();

  //   const response = await fetch("http://localhost:3000/register", {
  //     method: "POST",
  //     body: JSON.stringify({ username, password }),
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   if (response.status === 200) {
  //     alert("Registration successful.");
  //     navigate("/login");
  //   } else {
  //     alert("Registration failed. Try again.");
  //   }
  // }

  return (
    <form className="px-32 py-8 h-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Registrate en Unphu MiPymes Smart
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Ingresa los datos requeridos a continuacion...
          </p>
        </div>

        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Informacion Personal
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Por favor, ingrese su correo electrónico y contraseña para
            posteriormente acceder a la plataforma.
          </p>

          <div className="mt-10 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="nombre-cliente"
                  name="nombre-cliente"
                  type="text"
                  placeholder="Nombre del cliente"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={nombre}
                  onChange={(ev) => setNombre(ev.target.value)}
                />
              </div>
            </div>

            <div className=" sm:col-span-3">
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Correo del cliente"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={email_cliente}
                  onChange={(ev) => setEmail_cliente(ev.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mb-4 mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={contrasena}
                  onChange={(ev) => setContrasena(ev.target.value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                ¿Cómo se enteró del CMU?
              </legend>

              <div className="mt-6 ">
                <div className="flex items-center gap-x-3 mb-1">
                  <input
                    id="red-social-cmu"
                    name="red-social-cmu"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="Red Social Centro MiPymes Unphu"
                    checked={
                      selectedOptionConocio_CMU ===
                      "Red Social Centro MiPymes Unphu"
                    }
                    onChange={handleOptionChange}
                  />
                  <label
                    htmlFor="red-social-cmu"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Red Social Centro MiPymes Unphu
                  </label>
                </div>
                <div className="flex items-center gap-x-3 mb-1">
                  <input
                    id="red-social-unphu"
                    name="red-social-unphu"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="Red Social Unphu"
                    checked={selectedOptionConocio_CMU === "Red Social Unphu"}
                    onChange={handleOptionChange}
                  />
                  <label
                    htmlFor="red-social-unphu"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Red Social Unphu
                  </label>
                </div>
                <div className="flex items-center gap-x-3 mb-1">
                  <input
                    id="red-social-micm"
                    name="red-social-micm"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="Red Social MICM"
                    checked={selectedOptionConocio_CMU === "Red Social MICM"}
                    onChange={handleOptionChange}
                  />
                  <label
                    htmlFor="red-social-micm"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Red Social MICM
                  </label>
                </div>
                <div className="flex items-center gap-x-3 mb-1">
                  <input
                    id="red-social-banco-leon"
                    name="red-social-banco-leon"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="Red Social Banco Leon"
                    checked={
                      selectedOptionConocio_CMU === "Red Social Banco Leon"
                    }
                    onChange={handleOptionChange}
                  />
                  <label
                    htmlFor="red-social-banco-leon"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Red Social Banco Leon
                  </label>
                </div>

                <div className="flex items-center gap-x-3 ">
                  <input
                    id="otro-medio"
                    name="otro-medio"
                    type="radio"
                    value="Otro medio"
                    checked={selectedOptionConocio_CMU === "Otro medio"}
                    onChange={handleOptionChange}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="otro-medio"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Otro
                  </label>
                  {selectedOptionConocio_CMU === "Otro medio" && (
                    <div className="mt-4">
                      <input
                        id="customMessage"
                        type="text"
                        value={customMessage}
                        onChange={handleCustomMessageChange}
                        placeholder="Escriba como aquí"
                        className="ml-2 border placeholder:text-xs border-gray-300 rounded text-sm/6"
                      />
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Información Confidencial
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            La información que nos suministrará mediante este formulario y todos
            los documentos escritos del Centro Mipymes UNPHU en alianza al
            Ministerio de Industria Comercio y Mipymes se manejan
            confidencialmente y no serán revelados a una tercera parte sin su
            consentimiento.
          </p>

          <div className="sm:col-span-3">
            <div className="mt-2">
              <input
                id="telefono-empresa"
                name="telefono-empresa"
                type="text"
                placeholder="Teléfono del cliente"
                className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                value={telefono}
                onChange={(ev) => setTelefono(ev.target.value)}
              />
            </div>
          </div>

          <h6 className="mt-8 font-semibold text-sm text-gray-900">
            Información sobre la empresa
          </h6>
          <div className="mt-2 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="nombre-empresa"
                  name="nombre-empresa"
                  type="text"
                  placeholder="Nombre de empresa"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={nombre_empresa}
                  onChange={(ev) => setNombre_empresa(ev.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="correo-empresa"
                  name="correo-empresa"
                  type="email"
                  placeholder="Correo de empresa"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={email_empresa}
                  onChange={(ev) => setEmail_empresa(ev.target.value)}
                />
              </div>
            </div>

            <div className=" sm:col-span-3">
              <div className="mt-2">
                <textarea
                  id="descripcion-servicios"
                  name="descripcion-servicios"
                  rows={3}
                  placeholder="Breve descripción de los servicios o productos que ofrece"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={descripcion_servicios}
                  onChange={(ev) => setDescripcion_servicios(ev.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2 mb-4">
                <input
                  id="rubro-empresa"
                  name="rubro-empresa"
                  type="text"
                  placeholder="Rubro/Sector de empresa"
                  className="block w-96 placeholder:text-xs rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  value={rubro}
                  onChange={(ev) => setRubro(ev.target.value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                Su empresa ha generado más de 8,000 pesos mensuales?
              </legend>

              <div className="mt-6 ">
                <div className="flex items-center gap-x-3">
                  <input
                    id="si-ingresos"
                    name="si-ingresos"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="Si"
                    checked={selectedOptionIngresos === "Si"}
                    onChange={(ev) =>
                      setSelectedOptionIngresos(ev.target.value)
                    }
                  />
                  <label
                    htmlFor="si-ingresos"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    Si
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="no-ingresos"
                    name="no-ingresos"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    value="No"
                    checked={selectedOptionIngresos === "No"}
                    onChange={(ev) =>
                      setSelectedOptionIngresos(ev.target.value)
                    }
                  />
                  <label
                    htmlFor="no-ingresos"
                    className="block text-sm/6 font-normal text-gray-900"
                  >
                    No
                  </label>
                </div>
              </div>
            </fieldset>
            <fieldset className="mt-8">
              <legend className="text-sm/6 font-semibold text-gray-900">
                ¿Que servicios necesita actualmente?
              </legend>
              <div className="mt-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="asesoria-empresarial"
                      name="asesoria-empresarial"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value="Asesoría Empresarial"
                      checked={selectedOptionsIServiciosNecesarios.includes(
                        "Asesoría Empresarial"
                      )}
                      onChange={handleOptionChangeServicios}
                    />
                  </div>
                  <div className="text-sm/6">
                    <label
                      htmlFor="asesoria-empresarial"
                      className="font-normal text-gray-900"
                    >
                      Asesoría Empresarial
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="asesoria-financiera"
                      name="asesoria-financiera"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value="Asesoría Financiera"
                      checked={selectedOptionsIServiciosNecesarios.includes(
                        "Asesoría Financiera"
                      )}
                      onChange={handleOptionChangeServicios}
                    />
                  </div>
                  <div className="text-sm/6">
                    <label
                      htmlFor="asesoria-financiera"
                      className="font-normal text-gray-900"
                    >
                      Asesoría Financiera
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="asesoria-tecnologica"
                      name="asesoria-tecnologica"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value="Asesoría Tecnologica"
                      checked={selectedOptionsIServiciosNecesarios.includes(
                        "Asesoría Tecnologica"
                      )}
                      onChange={handleOptionChangeServicios}
                    />
                  </div>
                  <div className="text-sm/6">
                    <label
                      htmlFor="asesoria-tecnologica"
                      className="font-normal text-gray-900"
                    >
                      Asesoría Tecnológica
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="apoyo-asociacion-cooperativa"
                      name="apoyo-asociacion-cooperativa"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value="Apoyo con una asociación y/o cooperativa"
                      checked={selectedOptionsIServiciosNecesarios.includes(
                        "Apoyo con una asociación y/o cooperativa"
                      )}
                      onChange={handleOptionChangeServicios}
                    />
                  </div>
                  <div className="text-sm/6">
                    <label
                      htmlFor="apoyo-asociacion-cooperativa"
                      className="font-normal text-gray-900"
                    >
                      Apoyo con una asociación y/o cooperativa
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3 items-center">
                  <div className="flex h-6 items-center">
                    <input
                      id="otro-servicio"
                      name="otro-servicio"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value="Otro servicio"
                      checked={selectedOptionsIServiciosNecesarios.includes(
                        "Otro servicio"
                      )}
                      onChange={handleOptionChangeServicios}
                    />
                  </div>
                  <div className="text-sm/6">
                    <label
                      htmlFor="otro-servicio"
                      className="font-normal text-gray-900"
                    >
                      Otro
                    </label>
                  </div>

                  {selectedOptionsIServiciosNecesarios.includes(
                    "Otro servicio"
                  ) && (
                    <div className="mt-4">
                      <input
                        id="customMessageServicios"
                        type="text"
                        value={customMessageServicios}
                        onChange={(ev) =>
                          setCustomMessageServicios(ev.target.value)
                        }
                        placeholder="Escriba el servicio aquí"
                        className="ml-2 border placeholder:text-xs border-gray-300 rounded text-sm/6"
                      />
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          </div>
          <div className="mt-6 flex items-center justify-start gap-x-6 ">
            <button
              type="button"
              className="text-sm/6 font-semibold text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md  text-sm bg-green-700 py-1.5 px-3  font-semibold text-white shadow-sm hover:bg-verdementa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Guardar
            </button>
          </div>
          <div className="mt-3 text-xs text-start mb-10">
            ¿Ya te has registrado?
            <Link to="/login" className="ml-2 text-sky-500">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Signup;
