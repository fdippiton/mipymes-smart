import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./UserContext";
import { Dropdown } from "react-bootstrap";
import unphuMiPymes from "./assets/unphuMiPymes.jpg";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  //   const username = userInfo?.username;
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch("http://localhost:4000/profile", {
  //           credentials: "include",
  //         });

  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }

  //         const data = await response.json();
  //         setUserInfo(data);
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  //   async function logout() {
  //     try {
  //       await fetch("http://localhost:4000/logout", {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       // Después de la solicitud fetch, actualiza el estado
  //       setUserInfo(null);

  //       // Redirecciona a la página principal
  //       navigate("/");
  //     } catch (error) {
  //       console.error("Error during logout:", error);
  //       // Puedes manejar el error según tus necesidades
  //     }
  //   }

  return (
    <header className="m-0">
      <Link to="/" className="logo">
        <img
          src={unphuMiPymes}
          alt="Logo"
          style={{ width: "70px", height: "70px" }}
        />
        <h6>MiPymes Unphu Smart</h6>
      </Link>

      <nav>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Menu
              <ChevronDownIcon
                aria-hidden="true"
                className="-mr-1 h-5 w-5 text-gray-400"
              />
            </MenuButton>
          </div>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Iniciar Sesion Cliente
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Iniciar Sesion Admin
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Registrarse
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Salir
                </Link>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </nav>

      {/* <nav>
        {username && (
          <Dropdown>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <strong>{username}</strong> 
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="div">
                <Link to="/create" id="NewPost">
                  Create new post
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as="div">
                <Link onClick={logout} id="logout">
                  Logout
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
        {!username && (
          <>
            {" "}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav> */}
    </header>
  );
}
