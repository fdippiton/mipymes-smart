import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CrearAsesores() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [especialidades, setEspecialidades] = useState([]);
  const [meta, setMeta] = useState("");

  const handleOptionChangeEspecialidades = (e) => {
    const { value, checked } = e.target;

    // Si el checkbox está seleccionado, lo agregamos al array; si no, lo quitamos
    if (checked) {
      setEspecialidades([...especialidades, value]);
    } else {
      setEspecialidades(especialidades.filter((option) => option !== value));
    }
  };

  const handleChangeMeta = (e) => {
    setMeta(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <form className="">
        <div className="space-y-6 flex justify-start flex-col">
          <div className=" border-gray-900/10 ">
            <h2 className="text-xl font-semibold ">Crear asesor</h2>
            {/* <h2 className="text-base/7 font-semibold text-gray-900">
              Iniciar sesion
            </h2> */}
          </div>

          <div className=" border-gray-900/10 h-max">
            <div className="sm:grid-cols-6">
              <div className=" sm:col-span-2">
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
                <legend className="text-sm/6 font-semibold text-gray-900">
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
                        checked={especialidades.includes("Asesoría Financiera")}
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
                <label className="font-bold text-sm/6">Meta</label>
                <input
                  type="number"
                  value={meta}
                  onChange={handleChangeMeta}
                  min="0"
                  className="border w-20 rounded mt-2 ml-3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-start gap-x-6">
          <Link
            type="submit"
            className="rounded-md  bg-emerald-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tradewind focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Crear asesor
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CrearAsesores;
