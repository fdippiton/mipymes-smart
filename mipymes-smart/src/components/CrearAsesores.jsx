import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListarAsesores from "./ListarAsesores";

function CrearAsesores() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [metaClientes, setMetaClientes] = useState("");

  const handleOptionChangeEspecialidades = (e) => {
    const { value, checked } = e.target;

    // Si el checkbox está seleccionado, lo agregamos al array; si no, lo quitamos
    if (checked) {
      setEspecialidades([...especialidades, value]);
    } else {
      setEspecialidades(especialidades.filter((option) => option !== value));
    }
  };

  const handleChangeMetaClientes = (e) => {
    setMetaClientes(parseInt(e.target.value, 10));
  };

  const handleChangeMetaEncuentros = (e) => {
    setMetaEncuentros(parseInt(e.target.value, 10));
  };

  async function registrarAsesor(ev) {
    ev.preventDefault();

    const data = {
      nombre,
      contrasena,
      email,
      telefono,
      especialidades,
      metaClientes,
    };

    console.log(data);

    const response = await fetch("http://localhost:3000/registrarAsesor", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      alert("Registration successful.");
      setNombre("");
      setContrasena("");
      setEmail("");
      setTelefono("");
      setEspecialidades([]);
      setMetaClientes("");
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("Error en el registro. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="flex">
      <div>
        <form className="" onSubmit={registrarAsesor}>
          <div className=" flex justify-start flex-col">
            <div className="border-b border-gray-300 mb-3">
              <h2 className="text-md font-normal mb-3">Nuevo asesor</h2>
            </div>

            <div className=" border-gray-900/10 h-max">
              <div className="sm:grid-cols-6">
                <div className=" sm:col-span-2">
                  <div className="">
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="Nombre completo"
                      className="block w-96 placeholder:text-xs rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      value={nombre}
                      onChange={(ev) => setNombre(ev.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3 sm:col-span-2">
                  <div className="">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Correo"
                      className="block w-96 placeholder:text-xs rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 sm:col-span-2">
                  <div className="">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Contraseña"
                      className="block w-96 placeholder:text-xs rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      value={contrasena}
                      onChange={(ev) => setContrasena(ev.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-3 sm:col-span-2">
                  <div className="">
                    <input
                      id="telefono"
                      name="telefono"
                      type="text"
                      placeholder="Teléfono"
                      className="block w-96 placeholder:text-xs rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                      value={telefono}
                      onChange={(ev) => setTelefono(ev.target.value)}
                    />
                  </div>
                </div>

                <fieldset className="mt-4">
                  <legend className="text-sm/6 font-semibold text-gray-800">
                    Especialidades
                  </legend>
                  <div className="mt-3">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="asesoria-empresarial"
                          name="asesoria-empresarial"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          value="Asesoría Empresarial"
                          checked={especialidades.includes(
                            "Asesoría Empresarial"
                          )}
                          onChange={handleOptionChangeEspecialidades}
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
                          checked={especialidades.includes(
                            "Asesoría Financiera"
                          )}
                          onChange={handleOptionChangeEspecialidades}
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
                          checked={especialidades.includes(
                            "Asesoría Tecnologica"
                          )}
                          onChange={handleOptionChangeEspecialidades}
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
                          checked={especialidades.includes(
                            "Apoyo con una asociación y/o cooperativa"
                          )}
                          onChange={handleOptionChangeEspecialidades}
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
                  </div>
                </fieldset>

                <div className="my-4">
                  <label className="font-bold text-sm/6">Meta clientes</label>
                  <input
                    type="number"
                    value={metaClientes}
                    onChange={handleChangeMetaClientes}
                    min="0"
                    className="w-20 ring-1 border-0 ring-inset ring-gray-300 rounded mt-2 ml-3 p-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-start gap-x-6">
            <button
              type="submit"
              className="rounded-md w-50 text-center text-sm bg-green-700 py-1.5 px-3  font-normal text-white shadow-sm hover:bg-verdementa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Crear asesor
            </button>
          </div>
        </form>
      </div>

      <div className="ml-10">
        <ListarAsesores />
      </div>
    </div>
  );
}

export default CrearAsesores;
