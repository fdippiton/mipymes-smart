import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./UserContext";
import Centro from "./assets/Centro.svg";
import centromipymes from "./assets/centromipymes.png";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

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
            <div className="">
              <MenuItem>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-xs text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                >
                  Iniciar sesión
                </Link>
              </MenuItem>

              <MenuItem>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-xs text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none "
                >
                  Registrate
                </Link>
              </MenuItem>
              <MenuItem className="rounded-b-md">
                <Link
                  to="#"
                  className=" block px-4 py-2 text-xs text-red-600  data-[focus]:bg-gray-100 data-[focus]:text-red-800 data-[focus]:outline-none"
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
