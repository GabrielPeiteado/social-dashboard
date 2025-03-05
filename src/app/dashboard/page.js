"use client";
import { useEffect, useState, useMemo } from "react";
import { BarChart, LineChart, PieChart, DoughnutChart } from "@/components/Chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faRotate,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import axios from "axios";
import { socialPlatforms } from "@/utils/utils";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;


export default function Dashboard() {
  const [error, setError] = useState(null);

  // users with platforms
  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [platformFilter, setPlatformFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [followersMin, setFollowersMin] = useState(0);
  const [followersMax, setFollowersMax] = useState(1000000);
  const [engagementMin, setEngagementMin] = useState(0);
  const [postsMin, setPostsMin] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${FRONTEND_URL}/api/user`);
      setUsers(res.data);
      setFilteredUsers(res.data);
      setError(null);
      toast.success("User data refreshed successfully!");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch user data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // applying filters in real time
  useEffect(() => {
    let newUsers = [...users];

    if (platformFilter !== "All") {
      newUsers = newUsers.filter((user) =>
        user.socialData.some((data) => data.platform === platformFilter)
      );
    }

    if (sourceFilter !== "All") {
      newUsers = newUsers.filter((user) => user.source === sourceFilter);
    }

    newUsers = newUsers.map((user) => ({
      ...user,
      socialData: user.socialData.filter(
        (data) =>
          data.followers >= followersMin &&
          data.followers <= followersMax &&
          data.engagement >= engagementMin &&
          data.postsCount >= postsMin
      ),
    }));

    setFilteredUsers(newUsers);
  }, [
    platformFilter,
    sourceFilter,
    followersMin,
    followersMax,
    engagementMin,
    postsMin,
    users,
  ]);

  const resetFilters = () => {
    setPlatformFilter("All");
    setSourceFilter("All");
    setFollowersMin(0);
    setFollowersMax(1000000);
    setEngagementMin(0);
    setPostsMin(0);
    setFilteredUsers(users);
    toast.success("Filters reset!");
  };

  const validFilteredUsers = filteredUsers.filter(user =>
    user.socialData.some(data => platformFilter === "All" || data.platform === platformFilter)
  );
  

  const graphData = useMemo(() => {
    return validFilteredUsers.flatMap((user) =>
      user.socialData
        .filter((data) => platformFilter === "All" || data.platform === platformFilter)
        .map((data) => ({
          userId: user.id,
          userName: user.name,
          email: user.email,
          ...data,
        }))
    );
  }, [validFilteredUsers, platformFilter]);

  const graphDataLineChart = useMemo(() => {
    return users.flatMap((user) =>
      user.socialData
        .map((data) => ({
          userId: user.id,
          userName: user.name,
          email: user.email,
          ...data,
        }))
    );
  }, [users]);
  
  const userNames = [...new Set(graphData.map((item) => item.userName))];

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow-xl drop-shadow-xl text-gray-800">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <FontAwesomeIcon icon={faSliders} className="mr-2 text-xl w-5 h-5" />{" "}
          Filter Data
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Platform:
            </label>
            <select
              className="border p-2 rounded w-full"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="All">All platforms</option>
              {socialPlatforms.map((platform, i) => (
                <option key={i} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Source:
            </label>
            <select
              className="border p-2 rounded w-full"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="All">All sources</option>
              <option value="local">Local</option>
              <option value="external">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Followers:
            </label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={followersMin}
              onChange={(e) => setFollowersMin(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Followers:
            </label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={followersMax}
              onChange={(e) => setFollowersMax(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Engagement (%):
            </label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={engagementMin}
              onChange={(e) => setEngagementMin(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Min Posts:
            </label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={postsMin}
              onChange={(e) => setPostsMin(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center"
            onClick={resetFilters}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2 text-xl w-5 h-5" />
            Reset
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            onClick={fetchUsers}
          >
            <FontAwesomeIcon icon={faRotate} className="mr-2 text-xl w-5 h-5" />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {graphData.length > 0 ? (
          <>
            <BarChart data={graphData} userNames={userNames} />
            <LineChart data={graphDataLineChart} userNames={userNames} />
            <PieChart data={graphData} userNames={userNames} />
            <DoughnutChart data={users} />
          </>
        ) : (
          <p className="text-gray-500 text-center col-span-2">
            No data available for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
