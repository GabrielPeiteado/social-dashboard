"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faSort,
  faSortUp,
  faSortDown,
  faArrowRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function Table({ data, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // transformed the data structure: converted users into individual rows per platform
  const flattenedData = data.flatMap((user) =>
    user.socialData.map((social) => ({
      userId: user.id,
      userName: user.name,
      email: user.email,
      ...social,
    }))
  );

  useEffect(() => {
    setSortConfig({ key: null, direction: "asc" });
  }, [data]);

  // ordering
  const sortedData = [...flattenedData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const resetSorting = () => {
    setSortConfig({ key: null, direction: "asc" });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? faSortUp : faSortDown;
    }
    return faSort;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl text-gray-800">
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-semibold">User Social Data</h2>
        <button
          onClick={resetSorting}
          className="bg-gray-500 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-700 transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowRotateLeft} className="h-5 w-5" />
          Reset Sorting
        </button>
      </div>

      <table className="w-full table-auto border-collapse border-2">
        <thead>
          <tr className="bg-gray-900 text-gray-200">
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("userName")}
            >
              User{" "}
              <FontAwesomeIcon
                icon={getSortIcon("userName")}
                className="w-5 h-5"
              />
            </th>
            <th className="border p-2">Email</th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("platform")}
            >
              Platform{" "}
              <FontAwesomeIcon
                icon={getSortIcon("platform")}
                className="w-5 h-5"
              />
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("followers")}
            >
              Followers{" "}
              <FontAwesomeIcon
                icon={getSortIcon("followers")}
                className="w-5 h-5"
              />
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("engagement")}
            >
              Engagement (%){" "}
              <FontAwesomeIcon
                icon={getSortIcon("engagement")}
                className="w-5 h-5"
              />
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("postsCount")}
            >
              Posts{" "}
              <FontAwesomeIcon
                icon={getSortIcon("postsCount")}
                className="w-5 h-5"
              />
            </th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, i) => (
              <tr key={i} className="border-b text-center">
                <td className="border-2 p-2">{item.userName}</td>
                <td className="border-2 p-2">{item.email}</td>
                <td className="border-2 p-2">{item.platform}</td>
                <td className="border-2 p-2">
                  {item.followers.toLocaleString()}
                </td>
                <td className="border-2 p-2">{item.engagement?.toFixed(2)}%</td>
                <td className="border-2 p-2">{item.postsCount}</td>
                <td className="border p-2 flex justify-center gap-4">
                  <button
                    className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                    onClick={() => onEdit(item.userId, item.id)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => onDelete(item.userId, item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
