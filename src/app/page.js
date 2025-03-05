"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faTable,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Home() {

  const navbarSections = [
    {
      href: "/dashboard",
      text: "Explore Dashboard",
      icon: faChartLine,
      color: "bg-blue-500",
      hover: "hover:bg-blue-400",
    },
    {
      href: "/tables",
      text: "Explore Tables",
      icon: faTable,
      color: "bg-green-500",
      hover: "hover:bg-green-400",
    },
  ]

  const ctaRef = useRef(null);

  const scrollToCTA = () => {
    if (ctaRef.current) {
      ctaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-green-500 to-indigo-500 text-white">
        <h1 className="text-5xl font-bold text-center">
          Welcome to Social Dashboard
        </h1>
        <p className="mt-4 text-lg text-center max-w-2xl">
          Manage and analyze your social media performance with interactive
          charts, advanced filters, and real-time data.
        </p>

        <motion.div className="mt-6">
          <button
            onClick={scrollToCTA}
            className="bg-white text-blue-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition duration-300 flex items-center justify-center"
          >
            Learn More{" "}
            <FontAwesomeIcon icon={faArrowDown} className="ml-2 text-xl w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <div
        ref={ctaRef}
        className="w-full flex flex-col items-center justify-center py-24 bg-gray-900 text-white"
      >
        <h2 className="text-3xl font-bold mb-6">Start Exploring</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          {navbarSections.map((item, index) => (
            <Link href={item.href} key={index}>
              <motion.div
                className={`relative w-48 h-14 ${item.color} text-white rounded-lg shadow-lg ${item.hover} flex items-center justify-center`}
                whileHover={{ rotateX: 180 }}
                transition={{ duration: 0.5 }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                {/* front side button */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center backface-hidden"
                  animate={{ rotateX: 0 }}
                >
                  {item.text}
                </motion.div>

                {/* back side button */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center backface-hidden"
                  animate={{ rotateX: 180 }}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-xl w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>
          ))}

          <a
            href="https://www.linkedin.com/in/gabrielpeiteado/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              className="relative w-48 h-14 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 flex items-center justify-center"
              whileHover={{ rotateX: 180 }}
              transition={{ duration: 0.5 }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* front side button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center backface-hidden"
                animate={{ rotateX: 0 }}
              >
                Developed by
              </motion.div>

              {/* back side button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center backface-hidden"
                animate={{ rotateX: 180 }}
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-xl w-5 h-5" />
              </motion.div>
            </motion.div>
          </a>
        </div>
      </div>
    </div>
  );
}
