"use client";
import { Fragment } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { User } from "lucide-react";
import Link from "next/link";

export function ProfileMenu() {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="focus:outline-none p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
        <User className="w-6 h-6 text-white" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-900 z-50">
          <MenuItem>
            {({ active }) => (
              <Link
                href="/profile"
                className={`block px-4 py-4 text-sm ${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                }`}
              >
                Ver perfil
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <Link
                href="/edit-profile"
                className={`block px-4 py-4 text-sm ${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                }`}
              >
                Editar perfil
              </Link>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => console.log("Cerrar sesión")}
                className={`block w-full text-left px-4 py-4 text-sm ${
                  active ? "bg-red-100 text-red-700" : "text-gray-700"
                }`}
              >
                Cerrar Sesión
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
