import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./UserContext";
import Centro from "./assets/Centro.svg";
import centromipymes from "./assets/centromipymes.png";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Header() {
  const { userInfo, setUserInfo, authenticated, handleLogout } =
    useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoutSumit = (e) => {
    e.preventDefault();
    handleLogout();
    navigate("/login");
  };

  return (
    <header className="m-0">
      <Link to="/" className="logo flex align-middle py-2">
        <img
          src={centromipymes}
          alt="Logo"
          style={{ width: "90px", height: "50px" }}
          className=""
        />
        <h6 className=" text-emerald-400 ">MiPymes Unphu Smart</h6>
      </Link>

      <nav>
        <div className="text-sm font-medium">{userInfo?.nombre}</div>
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="inline-flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-md  focus:ring-2 ">
            Menu
            <ChevronDownIcon className="h-5 w-5 text-gray-400 ml-2" />
          </MenuButton>
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div>
              {userInfo?.nombre ? (
                // Si el usuario está autenticado
                <>
                  <MenuItem>
                    {userInfo?.rol?.descripcion === "Cliente" ? (
                      <Link
                        to="/cliente"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                      >
                        Cliente Dashboard
                      </Link>
                    ) : userInfo?.rol?.descripcion === "Administrador" ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                      >
                        Admin Dashboard
                      </Link>
                    ) : userInfo?.rol?.descripcion === "Asesor" ? (
                      <Link
                        to="/asesor"
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                      >
                        Asesor Dashboard
                      </Link>
                    ) : null}
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="#"
                      onClick={handleLogoutSumit}
                      // Función para cerrar sesión
                      className="text-red-600 block px-4 py-2 text-xs hover:bg-gray-100 hover:text-gray-900 rounded-md"
                    >
                      Salir
                    </Link>
                  </MenuItem>
                </>
              ) : (
                // Si el usuario no está autenticado
                <>
                  <MenuItem>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                    >
                      Iniciar sesión
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                    >
                      Registrarse
                    </Link>
                  </MenuItem>
                </>
              )}
            </div>
          </Menu.Items>
        </Menu>
      </nav>
    </header>
  );
}
