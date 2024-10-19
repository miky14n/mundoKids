"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-customPink text-customPurple">
      <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo aligned to the left */}
          <div className="flex-shrink-0 flex items-center pl-0">
            <Link href="/">
              <Image src="/Logo.png" alt="Logo" width="200" height="200" />
            </Link>
          </div>

          {/* Navigation items aligned to the right */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link href="/">
              <span className="hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/about">
              <span className="hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                About
              </span>
            </Link>
            <Link href="/services/listOfServices">
              <span className="hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                Services
              </span>
            </Link>
            <Link href="/contact">
              <span className="hover:bg-purple-50 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                Contact
              </span>
            </Link>
          </div>

          {/* Menu for mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/">
            <span className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Home
            </span>
          </Link>
          <Link href="/about">
            <span className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              About
            </span>
          </Link>
          <Link href="/services">
            <span className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Services
            </span>
          </Link>
          <Link href="/contact">
            <span className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Contact
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
