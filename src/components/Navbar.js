"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/../public/logomini.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faChartLine,
  faTable,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [isDarkTheme, setIsDarkTheme] = useState(false);

  // useEffect(() => {
  //   const currentTheme = localStorage.getItem("theme");
  //   if (currentTheme) {
  //     setIsDarkTheme(currentTheme === "dark");
  //     document.body.classList.toggle("dark", currentTheme === "dark");
  //   }
  // }, []);

  // const toggleTheme = () => {
  //   const newTheme = isDarkTheme ? "light" : "dark";
  //   setIsDarkTheme(!isDarkTheme);
  //   document.body.classList.toggle("dark", !isDarkTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

  return (
    <>
      <nav className="bg-[#0A0A0AF2] text-white p-4 flex justify-between items-center fixed w-full z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logo} alt="Company Logo" width={32} height={32} />
          <span className="font-mono uppercase">CAMALEONIC ANALYTICS</span>
        </Link>
        <div>
          {/* <button
            onClick={toggleTheme}
            className="text-white px-4 rounded-md focus:outline-none text-xl cursor-pointer"
          >
            {isDarkTheme ? "🌞" : "🌙"}
          </button> */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white px-4 rounded-md focus:outline-none text-xl cursor-pointer"
          >
            ☰
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        ></div>

        <div
          className={`fixed top-0 right-0 w-64 h-full bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 text-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            background:
              "linear-gradient(217deg, rgb(7, 178, 142), rgba(255, 0, 0, 0) 70.71%), linear-gradient(127deg, rgb(95, 189, 145), rgba(0, 255, 0, 0.1) 70.71%), linear-gradient(336deg, rgb(0, 100, 191), rgba(0, 0, 255, 0.5) 70.71%)",
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl focus:outline-none cursor-pointer"
          >
            ✖
          </button>

          <ul className="mt-6 space-y-4">
            <li>
              <Link
                href="/"
                className={pathname === "/" ? "text-yellow-300 font-bold" : "hover:text-yellow-300"}
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faHouseChimney}
                  className="mr-2 text-xl w-5 h-5"
                />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={
                  pathname === "/dashboard" ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
                }
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="mr-2 text-xl w-5 h-5"
                />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/tables"
                className={
                  pathname === "/tables" ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
                }
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon
                  icon={faTable}
                  className="mr-2 text-xl w-5 h-5"
                />
                Tables
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
