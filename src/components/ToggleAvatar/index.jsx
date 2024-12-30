"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
export default function ToggleAvatar({ name = "?", avatarSrc = null }) {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      {/* Trigger del dropdown */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 transition-transform hover:scale-105 focus:outline-none bg-cyan-300 dark:bg-gray-800"
        id="dropdown-avatar-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        {avatarSrc ? (
          <Image
            className="rounded-full"
            width={40}
            height={40}
            alt="User Avatar"
            src={avatarSrc}
          />
        ) : (
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {getInitial(name)}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600"
          role="menu"
          aria-labelledby="dropdown-avatar-button"
        >
          {/* Opciones del menú */}
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => console.log("Cambiar Contraseña")}
                role="menuitem"
              >
                Cambiar Contraseña
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-600 dark:text-red-400"
                onClick={handleClick}
                role="menuitem"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
