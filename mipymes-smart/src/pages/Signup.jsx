import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function Signup() {
  const [nombre, setNombre] = useState("");
  const [email_cliente, setEmail_cliente] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [email_empresa, setEmail_empresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rubro, setRubro] = useState("");
  const [descripcion_servicios, setDescripcion_servicios] = useState("");
  const [conocio_CMU, setConocio_CMU] = useState("");
  const [ingresos, setIngresos] = useState("");
  const navigate = useNavigate();

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
    <form className="px-16 py-8">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Registrate en Unphu MiPymes Smart
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Ingresa los datos requeridos a continuacion...
          </p>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Informacion Personal
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Por favor, ingrese su correo electrónico y contraseña para
            posteriormente acceder a la plataforma.
          </p>

          <div className="mt-10 gap-y-8 sm:grid-cols-6">
            <div className="my-6 sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Nombre del Cliente
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="my-6 sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo del cliente
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="my-6  sm:col-span-3">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">
                ¿Como se enteró del CMU?
              </legend>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="red-social-cmu"
                    name="red-social-cmu"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="red-social-cmu"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Red Social Centro MiPymes Unphu
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="red-social-unphu"
                    name="red-social-unphu"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="red-social-unphu"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Red Social Unphu
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-nothing"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    No push notifications
                  </label>
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

          <div className="mt-10 gap-y-8 sm:grid-cols-6">
            <div className="my-6 sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Nombre del Cliente
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="my-6 sm:col-span-3">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Correo del cliente
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="my-6  sm:col-span-3">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

export default Signup;

{
  /* <form className="register" onSubmit={register}>
      <h4>MiPymes Unphu Smart</h4>
      <h6>Register</h6>
      <input
        type="text"
        placeholder="Nombre Cliente"
        value={username}
        onChange={(ev) => setNombre(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form> */
}
